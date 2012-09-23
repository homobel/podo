
var obj = {},
	obs = podo.observer(obj),
	fn = function(name) {console.log(name);}

	obs.on('t', 'changed', fn);

	obs.set('t', 2);
