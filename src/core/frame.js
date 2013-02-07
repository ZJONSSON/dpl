dpl.frame = function(g) {
  if (g.select) g = g.node();
  if (g.tagName != "svg" && g.nearestViewportElement) g = g.nearestViewportElement;
  return g.frame || (g.frame = dpl_frame(g));
};

function dpl_frame(g) {
  var frame = {},
      scales = {},
      margin = {top:40,bottom:60,left:40,right:40},
      dispatch = d3.dispatch("resize","render");

  // REBIND
  // d3.rebind would need https://github.com/mbostock/d3/pull/1067
  frame.resize = function() { dispatch.resize.apply(dispatch,arguments); return frame} 
  frame.render = function() { dispatch.render.apply(dispatch,arguments); return frame} 
  frame.on = function() { dispatch.on.apply(dispatch,arguments); return frame} 


  // SCALES CORE
  function scale(ax,d,properties) {
    if (arguments.length == 0) return Object.keys(scales)
    if (arguments.length==1) return scales[ax] || (scales[ax] = d3.scale.linear());
    scales[ax] =d || scales[ax]
    if (properties) Object.keys(properties).forEach(function(d) {
      scales[ax][d] = properties[d]
    })
    return frame;
  };
  frame.scale = scale;

  ["range","domain"].forEach(function(fn) {
    frame[fn] = function(ax,d) {
      var s = scale(ax);
      if (arguments.length == 1) return s[fn]();
      s[fn](d3.functor(d)(s[fn]()) || s[fn]());
      return frame;
    }
  })

  frame.project = function(ax,id) {
    var s = frame.scale(ax);
    if (!isNaN(id)) return function() { return s(id);};
    id = id || ax;
    return function(d) {
      return s((d[id]!=undefined) ? d[id] : (d[ax]!=undefined) ? d[ax] : d)          
    }
  }

  frame.interval = function(ax,id) {
    return function(d) { return Math.abs(frame.project(ax,id)(d)-frame.project(ax)(0)) }
  }

  // MARGIN AND RANGES
  frame.margin = function(d) {
    if (arguments.length == 0) return margin;
    (["left","top","right","bottom"]).forEach(function(e,i) { 
        if (typeof d =="number") {margin[e] = d}
        else if (d[e]!=null){margin[e]=d[e]}
        else if (d[i]!=null){margin[e]=d[i]}
      })
    frame.resize();
    return frame;
  }

  frame.on("resize.frame",function() {
    // Sort out chart position and margins
    var h =  (g.attr("height") || g.property("offsetHeight") || 2000),
        w =  (g.attr("width") || g.property("offsetWidth")),
        ch = [margin.top,h-margin.top-margin.bottom],
        cw = [margin.left,w-(margin.right+margin.left)];

     // Refresh the ranges of the scales to match height / width
    frame.scale("w").range([0,w])
    frame.scale("h").range([0,h])
    frame.scale("cw").range(cw)
    frame.scale("bw").range(cw)
    frame.scale("pw").range(cw).domain(cw)
    frame.scale("ch").range(ch)
    frame.scale("bh").range(ch)
    frame.scale("ph").range(ch).domain(ch)
    return frame;
  });

  frame.on("resize.autorange",function() {
    var cw = scale("cw").range(),
        ch = scale("ch").range();

    frame.scale().forEach(function(d) {
      var scale = frame.scale(d),
          range = (scale.rangeBands) 
            ? function(d) { return scale.rangeBands(d,scale.padding || 0.1)}
            : function(d) { return scale.range(d)};
        
      if (d[0] == 'x') range(cw);
      if (d[0] == 'y') range([ch[1],ch[0]]);
    })
  })

  // CONVENIENCE SELECTORS
  frame.g = g = d3.select(g);

  frame.all = function() { 
    return g.selectAll("*") 
  }

  // DEFAULT SCALES  
  scale("x");
  scale("y");
  scale("y2")

  frame.resize();
  return frame;
};


