// Generates a unique ID for clip-path IDs
var uniqueID=0;

var default_y_fit = function(d) { return [d[0]*0.9,d[1]*1.1]}

dpl.chart = function (g) { 
  if (!g.select) g=d3.select(g);
  var chart = dpl.frame(g);
  if (chart.graph) return chart;

 ["back","cliparea","graph","overlay"].forEach(function(d) {
    chart[d] = g.append("g").classed(d,true)
  });

  chart.showAxes = function() {chart.back.call(dpl.showAxes.apply(chart,arguments)); return chart}
  chart.setTitle = function() {chart.overlay.call(dpl.setTitle.apply(chart,arguments)); return chart}
  chart.fitScale = function(ax,fn) {chart.all().call(dpl.fitScale(ax,fn));return chart}

 var legend = chart.overlay.append("g").classed("legend",true).datum({x:0.05,y:0.05}).attr("data-scale","chart")

 // Clippath keeps our graph within specified limit
 uniqueID++;
  chart.cliparea.append("clipPath")
    .attr("id","graphClip"+(uniqueID))
    .append("rect")
      .classed("graphClip",true)
      .attr("data-scale-x","cw")
      .attr("data-scale-y","ch")
      .datum({x0:0,x1:1,y0:1,y1:0})
  
  chart.graph.attr("clip-path","url(#graphClip"+uniqueID+")");

  // Convenience function for adding new data (i.e. only enter())
  chart.enter = function(d,f) {
    var newdata = chart.graph.selectAll(".__newdata__").data(d).enter();
    if (arguments.length == 1) return newdata;
    d3.functor(f)(newdata);
    return chart;
  }

  chart.axis = function(ax,d) {
    var ax = chart.back.select(".axis."+ax).datum();
    if (arguments.length == 1) return ax.render;
    ax.render = d3.functor(d)(ax.render) || ax.render;
    return chart;
  }

  chart.tickFormat = function(ax,d) {
    chart.axis(ax).tickFormat(d);
    return chart;
  }

  chart.on("resize.autofit",function()  {
    var nodes = chart.graph.selectAll(":not(.exiting)");
    nodes.call(dpl.fitScale("x"))
    nodes.call(dpl.fitScale("y",default_y_fit))
    nodes.call(dpl.fitScale("y2",default_y_fit))
  } )

  chart.on("resize.cliparea",function() {
    chart.cliparea.selectAll("rect").call(dpl.render)
  })


  chart.legend = dpl.legend(legend);

  chart.on("render.autolegend",function() {
    var g = chart.graph.selectAll("[data-legend]");
    if (g.empty()) return legend.selectAll("*").remove()
    g.call(chart.legend);
    legend.call(dpl.render)
  })


  chart.on("render.autobbox",function(duration,delay) {
    var bbox = chart.back[0][0].getBBox();
    chart.scale("bw").range([bbox.x,bbox.x+bbox.width])
    chart.scale("bh").range([bbox.y,bbox.y+bbox.height])
    chart.overlay.selectAll("*").transition().duration(duration).delay(delay).call(dpl.render)
  })

  chart.on("render.frame",function(duration,delay) {
    chart.resize();
    var g = chart.all()
    if (duration || delay) g=g.transition().duration(duration).delay(delay);
    //var g = (duration || delay) ? frame.g.transition().duration(duration).delay(delay) : g;
    g.call(dpl.render)
  })


   chart.add = chart.enter // Legacy
   chart.showAxes(["x","y"])
   return chart;
}