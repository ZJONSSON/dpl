// Creates an d3.svg.axis() that attaches to a name of a scale
// This allows us to change the underlying scale object knowing
// that the axis will reattach by name.

// Also allows us to specify .tickScale() instead of .tickSize()

dpl.axis = function(ax) {
  var _axis = d3.svg.axis(),
      tickScale;

  function axis(g) {
    //var set = g[0][0].nearestViewportElement.frame;
    var set = dpl.frame(g)
    _axis.scale(set.scale(ax));
    // Update the tickSize 
    if (tickScale) {
      var range = set.scale(tickScale).range();
      _axis.tickSize( Math.abs(range[1]-range[0]) * ((_axis.orient() == "bottom" || _axis.orient() == "left") ? -1 : 1))
    } 
    return _axis(g);
  }
  rebind(axis,_axis)
  
  axis.scale = function(d) {
    if (arguments.length == 0) return ax;
    ax = d;
   
    return axis;
  }

  axis.tickScale = function(d) {
    if (arguments.length == 0) return tickScale;
    tickScale = d;
    return axis;
  }

  return axis;
};
