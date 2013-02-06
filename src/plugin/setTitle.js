var title_def  = 
  {
    chart:{x:0.5,y:0,attr:{dy:"-1em","data-scale-x":"cw","data-scale-y":"ch"},style:{"text-anchor":"middle"}},
    x:{x:0.5,y:1,attr:{dy:"0.7em","data-scale-x":"cw","data-scale-y":"bh"},style:{"text-anchor":"middle"}},
    y: {x:0,y:0.5,rotate:-90,attr:{dy:"-0.5em","data-scale-x":"bw","data-scale-y":"ch"},style:{"text-anchor":"middle"}},
    y2:  {x:1,y:0.5,attr:{dy:"-0.5em","data-scale-x":"bw","data-scale-y":"ch"},rotate:90,style:{"text-anchor":"middle"}},
    y_top:  {x:0,y:0,attr:{dy:"-0.7em","data-scale-x":"cw","data-scale-y":"ch"},style:{"text-anchor":"end"}},
    y_inside : {x:0,y:0, attr:{"dy":"1em",dx:"-0.5em","data-scale":"chart"},rotate:-90,style:{"text-anchor":"end"}},
    y2_inside : {x:1,y:0, attr:{"dy":"-0.5em",dx:"-0.5em","data-scale":"chart"},rotate:-90,style:{"text-anchor":"end"}},
    x_inside : {x:1,y:1,attr:{"dy":"-0.5em","data-scale":"chart"},style:{"text-anchor":"end"}},
    y2_top:  {x:1,y:0,attr:{dy:"-0.7em","data-scale-x":"cw","data-scale-y":"ch"},style:{"text-anchor":"start"}},
    center:  {x:0.5,y:0.5,attr:{"data-scale-x":"cw","data-scale-y":"ch"},style:{"text-anchor":"middle"}}
  };

Object.keys(title_def).forEach(function(key) {
  title_def[key].id = key;
})

dpl.setTitle = function(title,text) {
  return function(g) {
    g.each(function(d,i) {
      d3.select(this).selectAll(".title."+title).data([title_def[title]])
      .call(function(d) { d.enter().append("text").attr("class","title "+title)})
      .text(d3.functor(text)(d,i))
      .call(dpl.render)
    })
  }
};