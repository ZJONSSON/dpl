// Creates an d3.svg.axis() that attaches to a name of a scale
// This allows us to change the underlying scale object knowing
// that the axis will reattach by name.

// Also allows us to specify .tickScale() instead of .tickSize()

dpl.axis = function(ax) {
  var _axis = d3.svg.axis(),
      tickScale;

  function axis(g) {
    var frame = dpl.frame(g)
    _axis.scale(frame.scale(ax));
    // Update the tickSize 
    if (tickScale) {
      var range = frame.scale(tickScale).range();
      _axis.tickSize( Math.abs(range[1]-range[0]) * ((_axis.orient() == "bottom" || _axis.orient() == "left") ? -1 : 1))
    } 
    return _axis(g);
  }
  d3.rebind(axis,_axis,"orient","ticks","tickValues","tickSubdivide","tickSize","tickPadding","tickFormat")
  
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
