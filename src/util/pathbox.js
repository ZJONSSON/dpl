dpl.pathbox = function(line,padding) {
  var path=[],box=[];
if (padding==undefined) padding = 2;
  line.forEach(function(d,i) {
    var start,end;
    start =  (line[i-1]) 
      ? {x:(d.x+line[i-1].x)/2,y:(d.y+line[i-1].y)/2}
      : {x:d.x,y:d.y};

    end = (line[i+1])
      ? {x:(line[i+1].x+d.x)/2,y:(line[i+1].y+d.y)/2}
      : {x:d.x,y:d.y};

    path.push([start,start,end,end,start])
    // Reuse start and end for x numeric values  only
    start = (line[i-1]) ? start.x+padding : d.x-(line[i+1].x-d.x)/2+padding;
    end = (line[i+1]) ? end.x-padding : d.x+(d.x-line[i-1].x)/2-padding;
    box.push([{x:start,y:d.y},{x:start,y:0},{x:end,y:0},{x:end,y:d.y},{x:start,y:d.y}])  
  });
  return {line:path,box:box}
};


