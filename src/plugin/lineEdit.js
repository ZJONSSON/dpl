// Inspired by Mike Bostock's Spline Editor http://bl.ocks.org/4342190

dpl.lineEdit = function() {
  var drag = d3.behavior.drag()
  dpl.rebind(lineEdit,drag,[])
  function lineEdit(g) {
    var chart = dpl.chart(g),
        line = g.append("path"),
        circles = g.append("g"),
        radius = 10,
        selected;

    
      drag.origin(function(d) {
        var res = { x:chart.project("x")(d), y:chart.project("y")(d)}
        return res
      })
      .on("drag.lineEdit",dragmove)

   

    function dragmove(d,i) {
      console.log(d,i)
      d.x = chart.scale("x").invert(d3.event.x);
      d.x = Math.max(d.x,(g.datum()[i-1]) ? g.datum()[i-1].x : chart.domain("x")[0]);
      d.x = Math.min(d.x,(g.datum()[i+1]) ? g.datum()[i+1].x : chart.domain("x")[1]);
      d.y = chart.scale("y").invert(d3.event.y)
      line.call(dpl.render)
      d3.select(this).call(dpl.render)
    }

    function refresh() {
      circles.selectAll("circle").data(Object)
        .call(function(e) { e.exit().remove()})
        .call(function(e) { 
          e.enter()
            .append("circle")
            .attr("r",radius)
            .call(drag)
            .on("mousedown.selected",function(d) { selected = d;refresh()})
        })
        .classed("selected",function(d) { return d === selected})
        
    }
    refresh()
  }

  lineEdit.radius = function(d) {
    if (arguments.length == 0) return radius;
    radius = d;
    circles.selectAll("circle").attr("r",radius)
    return lineEdit;
  }

  lineEdit.datum = function() {
    return datum
  }

  return lineEdit;
};