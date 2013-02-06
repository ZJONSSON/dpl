dpl.fitScale = function(ax,fn) {
  return function(g) {
    if (g.empty()) return;
    var set = dpl.frame(g),
        domain,calcDomain;
    
    if (set.scale(ax).rangeBand) {
      domain = [];
      calcDomain = function(_ax,d) {
        if (domain.indexOf(d[_ax])==-1) domain.push(d[_ax]);
      }
    } else {

      domain=[+Infinity,-Infinity];

      var minMax = function(d) {
        if (isNaN(d)) return;
        domain[0] = Math.min(domain[0],d); 
        domain[1] = Math.max(domain[1],d)     
      }

      calcDomain = function(_ax,d) {
          if (!d) return;
          if (!d.length) d=[d];
          d.forEach(function(d) {
            minMax(d[_ax]);
            minMax(d[_ax+"0"]);
            minMax(d[_ax+"1"]);
            minMax(d[_ax+"2"]);
          })          
        }
    }

    g.each(function(d) {
      var self = d3.select(this),
          dsx = self.attr("data-scale-x"),
          dsy = self.attr("data-scale-y");

      if (dsx == ax || (!dsx && ax == 'x')) calcDomain("x",d);
      if (dsy == ax || (!dsy && ax == 'y')) calcDomain("y",d);
    })

    // Pass the results through a user function if applicable
    if (fn) domain = d3.functor(fn)(domain);    
    if (domain[0] != Infinity && domain[1] != -Infinity) set.scale(ax).domain(domain)
    return set
  }
};
