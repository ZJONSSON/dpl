dpl.legend = function(target) {
  var legendPadding =  5,
      orient = "dr";

  var legend = function(g) {
    if (!g || !g.each) return;
    var items = {},
        lc = target.selectAll(".legend-container").data([true]).call(function(d) { d.enter().append("g").classed("legend-container",true)}),
        lb = lc.selectAll(".legend-box").data([true]),
        li = lc.selectAll(".legend-items").data([true]);

    lb.enter().append("rect").classed("legend-box",true)
    li.enter().append("g").classed("legend-items",true)

    g.each(function() {
      var self = d3.select(this);
      if (!self.attr("data-legend")) return;
      items[self.attr("data-legend")] = {
        pos : self.attr("data-legend-pos"),
        by : this.getBBox().y,
        bh : this.getBBox().height,
        color : self.attr("data-legend-color") != undefined ? self.attr("data-legend-color") : self.style("fill") != 'none' ? self.style("fill") : self.style("stroke") 
      }
    })

    items = d3.entries(items).sort(function(a,b) {
      return (a.value.pos-b.value.pos) || (a.value.by-b.value.by) || (a.value.bh - b.value.bh)
    })

    li.selectAll("text")
      .data(items,function(d) { return d.key})
      .call(function(d) { d.enter().append("text")})
      .call(function(d) { d.exit().remove()})
      .attr("y",function(d,i) { return i+"em"})
      .attr("x","1em")
      .text(function(d) { ;return d.key})
    
    li.selectAll("circle")
      .data(items,function(d) { return d.key})
      .call(function(d) { d.enter().append("circle")})
      .call(function(d) { d.exit().remove()})
      .attr("cy",function(d,i) { return i-0.25+"em"})
      .attr("cx",0)
      .attr("r","0.4em")
      .style("fill",function(d) { return d.value.color })  
    
    // Reposition and resize the box
    var lbbox = li[0][0].getBBox() 

    var x = lbbox.x-legendPadding,
        y = lbbox.y - legendPadding,
        h = lbbox.height+2*legendPadding,
        w = lbbox.width+2*legendPadding;

    lb.attr("x",x)
      .attr("y",y)
      .attr("height",h)
      .attr("width",w)

    y = (orient[0] && orient[0]=='u') ? -h-y : -y;
    x = (orient[1] && orient[1]=='l') ? -w-x : -x;
    lc.attr("transform","translate("+x+","+y+")");

  }

   
  legend.padding = function(d) {
    if (arguments.length == 0) return d;
    legendPadding = d;
    return legend;
  }

  legend.orient = function(d) {
    if (arguments.length == 0) return d;
    orient = d;
    return legend;
  }


  return legend
};