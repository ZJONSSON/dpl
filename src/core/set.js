// dpl.set is a collection of scales.  Any undefined scales are initiated as d3.scale.linear by default. 

dpl.set = function() {
  var set  = {},
      scales = {};

  // Attach rebinds all methods to a target object.   We can not use d3.rebind here as
  // the input arguments are variable.  We therefore check whether output is the dpl,
  // and if so return the target
  set.rebind = function(target) {
    return rebind(set,target)
  }
  
  function scale(ax,d,properties) {
      if (arguments.length == 0) return Object.keys(scales)
      if (arguments.length==1) return scales[ax] || (scales[ax] = d3.scale.linear());
      scales[ax] =d || scales[ax]
      if (properties) Object.keys(properties).forEach(function(d) {
        scales[ax][d] = properties[d]
      })
      return set;    
  }
  set.scale = scale;

  ;["range","domain"].forEach(function(fn) {
    set[fn] = function(ax,d) {
      var s = scale(ax);
      if (arguments.length == 1) return s[fn]();
      s[fn](d3.functor(d)(s[fn]()) || s[fn]());
      return set;
    }
  })

  function project(ax,id) {
    id = id || ax;
    return function(d) {
      var s = scale(ax)
      return s((d[id]!=undefined) ? d[id] : (d[ax]!=undefined) ? d[ax] : d)          
    }
  }
  set.project = project;

  function interval(ax,id) {
    return function(d) { return Math.abs(project(ax,id)(d)-project(ax)(0)) }
  }
  set.interval=interval;
  
  
  set.axis = dpl.axis
  set.render = dpl.render;

  return set;
};