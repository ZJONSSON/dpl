dpl.project = function(ax,f) {
  return function(d) {
    return dpl.frame(d3.select(this)).project(ax,f)(d)
  }
};