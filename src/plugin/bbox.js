dpl.bbox = function(g) {
  var x = [Infinity,-Infinity], y = [Infinity,-Infinity];
  g.each(function() {
    var d = this.bbox;
    if (!d) return;
    x[0] = Min(x[0],d.x);
    x[1] = Max(x[1],d.x+d.width);
    y[0] = Min(y[0],d.y);
    y[1] = Max(y[1],d.y+d.width);
  });
  return {x:x,y:y};
};