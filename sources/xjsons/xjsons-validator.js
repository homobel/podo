
//~ <component>
//~	Name: XJSON Processor
//~	Info: eXtended JSON Shemas Processor
//~ </component>


function _XjsonsProcessor() {

	this.error = $.obj.extend(function(func) {
		this.errorHandlers.add(func);
	},
	{
		obj: function(val) {return val + ' should be an object';},
		arr: function(val) {return val + ' should be an array';},
		emb: function(val) {return val + ' should be an ' + (type || 'embedded');},
		wtf: function() {return 'WTF error occured';}
	});

	this.emitError = function(ptype, val, type) {
		this.errorHandlers.exec([this.error[ptype](val, type)]);
	};

	this.process = function() {

		var _this = this;

		// shema - value rules
		// obj - obj with property which is shema for

		function process(shema, obj) {

			var	propName = shema.inputProp || shema.outputProp,
				objC = obj[propName],
				otype = _.type(objC);

			if(shema.type === 'object') {
				if(otype.is('object')) {
					for(var prop in shema.value) {
						if(shema.value.hasOwnProperty(prop)) {
							if(!process(shema.value[prop], objC)) {
								return false;
							}
						}
					}
				}
				else {
					_this.emitError('obj', obj);
					return false;
				}
			}
			else if(shema.type === 'obj-template') {
				if(!otype.is('object')) {
					_this.emitError('obj', obj);
					return false;
				}
				for(var prop in obj) {
					if(obj.hasOwnProperty(prop)) {
						if(!process(shema.value[0], obj[prop])) {
							return false;
						}
					}
				}
			}
			else if(shema.type === 'array') {
				if(!otype.is('array')) {
					_this.emitError('arr', obj);
					return false;
				}
				for(var prop in shema.value) {
					if(shema.value.hasOwnProperty(prop)) {
						if(!process(shema.value[prop], obj[prop])) {
							return false;
						}
					}
				}
			}
			else if(shema.type === 'arr-template') {
				if(!otype.is('array')) {
					_this.emitError('arr', obj);
					return false;
				}
				for(var prop in obj) {
					if(obj.hasOwnProperty(prop)) {
						if(!process(shema.value[0], obj[prop])) {
							return false;
						}
					}
				}
			}
			else if(shema.type === 'embedded') {

				var toleranceFlag = true;

				if(shema.value === 'I') {
					obj = parseInt(obj);
					shema.value = i;
				}
				else if(shema.value === 'F') {
					obj = parseFloat(obj);
					shema.value = f;
				}
				else if(shema.value === 'D') {
					obj = +obj;
					shema.value = d;
				}
				else if(shema.value === 'B') {
					obj = !!obj;
					shema.value = b;
				}
				else if(shema.value === 'U') {
					obj = undefined;
					shema.value = u;
				}
				else if(shema.value === 'S') {
					obj += '';
					shema.value = s;
				}
				else if(shema.value === 'N') {
					obj = null;
					shema.value = n;
				}

				if(shema.value === 'i') {

				}
				else if(shema.value === 'f') {

				}
				else if(shema.value === 'd') {

				}
				else if(shema.value === 'b') {

				}
				else if(shema.value === 'u') {

				}
				else if(shema.value === 's') {

				}
				else if(shema.value === 'n') {

				}

			}
			else {
				_this.error.wtf();
			}

			return true;
		}

		return process(this.xjsons, this.target, true);
	};

}

function XjsonsProcessor(shema, obj) {

	if(shema.xjsons) {
		this.xjsons = shema.xjsons;
	}
	else {
		throw Error('First argument should be a xjsons');
	}

	this.target = {'xjsons': obj};
	this.errorHandlers = $.funcList();
	// this.output

}

XjsonsProcessor.prototype = new _XjsonsProcessor();
