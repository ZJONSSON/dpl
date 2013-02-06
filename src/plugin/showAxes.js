if (!dpl.def) dpl.def = {};

 dpl.def.axis = {
    x : function() { return {scale:"x",tickScale:"ch",y:1,orient:"bottom",attr: {"data-scale-x":"cw","data-scale-y":"ch"}}},
    y:  function() { return {scale:"y",tickScale:"cw",x:0,orient:"left",attr: {"data-scale-x":"cw","data-scale-y":"ch"}}},
    y2: function() { return {scale:"y2",x:1,orient:"right",attr: {"data-scale-x":"cw","data-scale-y":"ch"}}}
  };


dpl.showAxes = function(axes) {
   axes = [].concat(axes).map(function(d) {
    var ax =  dpl.def.axis[d]();
    ax.render = dpl.axis(d).orient(ax.orient).tickScale(ax.tickScale)
    return ax;
  }).filter(function(d) {
    return d;
  });

  return function(g) {
    g.each(function() {
      d3.select(this).selectAll(".axis").data(axes)
      .call(function(d) { d.exit().remove()})
      .enter()
        .append("g")
        .attr("class",function(d) { return "axis "+d.scale})
    })
  }   
}
 
