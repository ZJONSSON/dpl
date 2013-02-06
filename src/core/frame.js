function dpl_frame(g) {
  var margin = {top:40,bottom:60,left:40,right:40},
      dispatch = d3.dispatch("resize","render"),
      selector = "*";
    
  var frame = dpl.set(),
      scale = frame.scale;

  rebind(frame,dispatch,["resize","render"]);  

  frame.g = g = d3.select(g);

  frame.all = function() { 
    return g.selectAll(selector) 
  }

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

  // If render is called wihout argument or with "all", all elements are rendered
  frame.on("render.frame",function(duration,delay) {
    frame.resize();
    var g = frame.all()
    if (duration || delay) g=g.transition().duration(duration).delay(delay);
    //var g = (duration || delay) ? frame.g.transition().duration(duration).delay(delay) : g;
    g.call(dpl.render)
  })


  frame.add = function(d,e) {
    return g.selectAll(".__newdata__")
      .data(d,e).enter()
  }
  
  scale("x");
  scale("y");
  scale("y2")

  frame.resize();
  return frame;
};


dpl.frame = function(g) {
  if (g.select) g = g[0][0];
  if (g.tagName != "svg" && g.nearestViewportElement) g = g.nearestViewportElement;
  return g.frame || (g.frame = dpl_frame(g));
};

