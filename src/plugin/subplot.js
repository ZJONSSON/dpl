dpl.subplot = function(g,rows,cols,num) {
  var subplots = g.g.selectAll(".subplot").data(d3.range(rows*cols))
  subplots.enter().append("svg").call(dpl.chart()).attr("class",function(d,i) { return "subplot subplot"+i})
  subplots.exit().remove();
  return sublots[0][num].frame;
};