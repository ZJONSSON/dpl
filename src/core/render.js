dpl.render = function(elements) {
  if (!elements.each) return;
  
  elements.each(function() {
    if (!this.nearestViewportElement) return;
    var chart = this.nearestViewportElement.frame;
    var self = d3.select(this);
    
    //if (!self.attr("data-scale")) return;
    var d=self.datum();
    var  g = d3.transition(self)

    if (!d) return;
    if (d.attr) self.attr(d.attr);
    if (d.style) self.attr(d.style);

    if (typeof d.render == "function") d.render.call(self.datum(),g);
    if (self.attr("data-scale")=="ignore") return;
    
  var x = self.attr("data-scale-x") || "x",
      y = self.attr("data-scale-y") || "y";

    if (self.attr("data-scale") == "chart") { x = "cw"; y = "ch"}
    if (self.attr("data-scale") == "box") {x = "bw"; y = "bh"}

    if (this.tagName == "g" || this.tagName == "text") {
      var dx = (d.x != undefined) ? chart.project(x,"x")(d) : 0,
          dy = (d.y != undefined) ? chart.project(y,"y")(d) : 0;
      if (dx || dy)  g.attr("transform","translate("+dx+","+dy+")rotate("+(d.rotate||0)+")");
    } else if (this.tagName == "path") {
      if (d[0] && d[0].y1 != undefined) {
        g.attr("d",d3.svg.area()
          .x(chart.project(x,"x"))
          .y(chart.project(y,"y1"))
          .y0(chart.project(y,"y0"))
        )
      } else {
        g.attr("d",d3.svg.line()
          .x(chart.project(x,"x"))
          .y(chart.project(y,"y"))
          .interpolate(self.attr("data-interpolate") || "linear")
        )
      }
 /*   } else if (this.tagName == "line") {
        g.attr("x1",chart.project(x,"x1"))
         .attr("x2",chart.project(x,"x2"))
         .attr("y1",chart.project(y,"y1"))
         .attr("y2",chart.project(y,"y2"))
  */    
    } else if (this.tagName == "circle") {
      if (d.x != undefined) g.attr("cx",chart.project(x,"x"));
      if (d.y != undefined) g.attr("cy",chart.project(y,"y"));
    } else if (this.tagName == "rect" || this.tagName == "svg") {
      if (d.x == undefined && d.x0 == undefined) return;
      // If Ordinal index, we set width to RangeBand - else use
      if (chart.scale(x).rangeBands) {
        g.attr("x",chart.scale(x)((d.x != undefined) ? d.x : d.x0))
        g.attr("width",chart.scale(x).rangeBand)
      } else {
        var x0 = d.x0 || d.x || 0,
            x1 = (d.x1 != undefined) ? d.x1 : x0+(d.width || d.x),
            width = (d.width != undefined) ? d.width : Math.abs(x1-x0);
        g.attr("x",chart.scale(x)(x0))
        g.attr("width",chart.interval(x)(width))
      }

      if (chart.scale(y).rangeBands) {
        g.attr("y",chart.scale(y)((d.y != undefined) ? d.y : d.y0))
        g.attr("height",chart.scale(y).rangeBand)
      } else {
        var y0 = d.y0 || 0,
            y1 = (d.y1 != undefined) ? d.y1 : y0+(d.height || d.y),
            height = (d.height != undefined) ? d.height : Math.abs(y1-y0);
        g.attr("y",chart.scale(y)(y1))
        g.attr("height",chart.interval(y)(height))
      }
    }
    else {
      if (d.x != undefined) g.attr("x",chart.project(x,"x"));
      if (d.y != undefined) g.attr("y",chart.project(y,"y"));
    }
  })
};