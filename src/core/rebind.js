// Rebind binds selected fields (or all fields, if fields is null)
// from source to target.  If results are equal to source, target is returned.
function rebind(target,source,fields) {
  (fields || Object.keys(source)).forEach(function(d) {
    target[d] = function() {
      var result = source[d].apply(target,arguments);
      return (result === source) ? target : result;
    }
  })
  target.on = function() {
  	source.on.apply(source,arguments)
  	return target;
  }
  return target;
};
dpl.rebind = rebind