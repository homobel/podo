
//~ <component>
//~	Name: Podo Lib
//~	Info: Second abstraction level for redjs
//~ </component>


this.podo = new function() {


//~ <component>
//~	Name: Podo Lib init file
//~	Info: Second abstraction level for redjs
//~ </component>


	var $, podo = $ = this;


//~ <component>
//~	Name: Ree Lib init file
//~	Info: Working with embedded types
//~ </component>


	var ree = this;


//~ <component>
//~	Name: Type Helper
//~	Info: Provides type function
//~ </component>


function ReeType() {

	// Type obj

	function _Type() {

		this.toString = function() {
			return Type.variants[this.val];
		};

		this.is = function(typeStr) {
			if(typeof typeStr === 'string') {
				return Type.variants[this.val] === typeStr;
			}
			else {
				return (Type.variants[this.val] === 'object' || Type.variants[this.val] === 'function') && this.source instanceof typeStr;
			}
		};

	}

	function Type(n, val) {
		this.val = n;
		this.source = val;
	}

	function type(val) {

	}

	Type.prototype = new _Type();

	Type.variants = [
		'undefined',
		'boolean',
		'number',
		'string',
		'function',
		'array',
		'object',
		'NaN',
		'null',
		'unknown'
	];

	// Logic fn

	function getType(something) {

		var type = typeof something;

		if(type === 'undefined') {
			return getType['undefined'];
		}
		else if(type === 'boolean') {
			return getType['boolean']
		}
		else if(type === 'number') {
			if(isNaN(something)) {
				return getType['NaN'];
			}
			else {
				return getType['number'];
			}
		}
		else if(type === 'string') {
			return getType['string'];
		}
		else if(type === 'function' && something.call) {
			return getType['function'];
		}
		else if(something === null) {
			return getType['null'];
		}
		else if(type === 'unknown') {
			return getType['unknown'];
		}
		else {
			return getType['object'];
		}

	}


	for(var i = 0, l = Type.variants.length; i < l; i++) {
		getType[Type.variants[i]] = i;
		getType[i] = Type.variants[i];
	}

	this.type = function(something) {
		return new Type(getType(something), something);
	};
}


//~ <component>
//~	Name: Yobject
//~	Info: Provide object helpers
//~ </component>

function ReeObject() {

	this.obj = new function() {

		function propOfVal(obj, val, identityFlag) {
			for(var prop in obj) {
				if(obj.hasOwnProperty(prop) && ((identityFlag && obj[name] === val) || obj[name] == val)) {
					return name;
				}
			}
		}

		this.propOfVal = propOfVal;

		// each

		function each(obj, fn, thisObj) {
			for(var prop in obj) {
				if(fn.call(thisObj, obj[prop], prop, this)) {
					break;
				}
			}
		}

		this.each = each;

		function isEmpty(obj) {
			for(var prop in obj) {
				if(obj.hasOwnProperty(prop)) {
					return false;
				}
			}
			return true;
		}

		this.isEmpty = isEmpty;

		function join() {
			var Obj = {};
			for(var i = 0; i < arguments.length; i++) {
				if(arguments[i]) {
					for(var p in arguments[i]) {
						if(arguments[i].hasOwnProperty(p)) {
							Obj[p] = arguments[i][p];
						}
					}
				}
			}
			return Obj;
		}

		this.join = join;

		function _joinSoft(target, extender) {
			for(var prop in extender) {
				if(extender.hasOwnProperty(prop)) {
					if(typeof extender[prop] == 'object') {
						target[prop] = joinSoft(target[prop], extender[prop]);
					}
					else {
						target[prop] = extender[prop];
					}
				}
			}
			return target;
		}

		function joinSoft() {
			var Obj = copyObj(arguments[0]);
			for(var i = 0; i < arguments.length; i++) {
				if(arguments[i]) {
					Obj = _joinSoft(Obj, arguments[i]);
				}
			}
			return Obj;
		}

		this.joinSoft = joinSoft;

		function copy(obj) {
			return join(obj);
		}

		this.copy = copy;

		function extend(target) {
			for(var i = 1; i < arguments.length; i++) {
				if(arguments[i]) {
					for(var prop in arguments[i]) {
						if(arguments[i].hasOwnProperty(prop)) {
							target[prop] = arguments[i][prop];
						}
					}
				}
			}
			return target;
		}

		this.extend = extend;

		function innerProp(obj, prop, val) {

			prop = prop.split('.');
			var pl = prop.length - 1;

			if(val === undefined) {
				if($.arr.every(prop, function(c, i) {
					if(typeof obj === 'object' && c in obj) {
						obj = obj[c];
						return true;
					}
				})) {
					return obj;
				}
			}
			else {
				$.arr.each(prop, function(c, i) {
					if(i === pl) {
						return obj[c] = val;
					}
					else {
						if(typeof obj[c] !== 'object') {
							if(innerProp.mode) {
								obj[c] = {};
							}
							else {
								throw Error('Can\'t redeclare property in strict mode!');
							}
						}
						obj = obj[c];
					}
				});
			}
		}

		// 0 - on the strict mode

		innerProp.mode = 1;

		this.innerProp = innerProp;

	};

}


//~ <component>
//~	Name: Yarray
//~	Info: Provide array helpers
//~ </component>


function ReeArray() {

	var parent = this;

	this.arr = new function() {

		// forEachInvert

		function eachInvert(arr, fn, thisObj) {
			for(var i = arr.length; i--; ) {
				if(i in arr) {
					fn.call(thisObj, arr[i], i, arr);
				}
			}
		}

		this.eachInvert = eachInvert;

		// copy

		function copy(arr) {
			return arr.slice(0);
		};

		this.copy = copy;

		// del

		function del(arr, n) {
			if(n in arr) {
				arr.splice(n, 1);
			}
			return arr;
		}

		this.del = del;

		// delByVal

		function delByVal(arr, value) {
			del(arr, indexOf(arr, value));
			return arr;
		}

		this.delByVal = delByVal;

		// linear

		function linear(arr) {
			var M = [];
			function linear(m) {
				if(m instanceof Array) {
					each(m, linear);
				}
				else {
					M.push(m);
				}
			}

			linear(arr);
			return M;
		}

		this.linear = linear;

		// pushOnce

		function pushOnce(arr, n) {
			var index = indexOf(arr, n);
			if(!~index) {
				arr.push(n);
				return arr.length - 1;
			}
			return index;
		}

		this.pushOnce = pushOnce;

		// last

		function last(arr) {
			return arr[arr.length - 1];
		}

		this.last = last;

		// last index

		function lastIndex(arr) {
			return arr.length - 1;
		}

		this.lastIndex = lastIndex;

		// append

		function append(arr) {
			for(var i = 1, l = arguments.length; i < l; i++) {
				arr.push(arguments[i]);
			}
			return arr;
		}

		this.append = append;

		// prepend

		function prepend(arr) {
			var args = Array.prototype.slice.call(arguments, 1);
			Array.prototype.unshift.apply(arr, args);
			return arr;
		}

		this.prepend = prepend;

		function pop(arr) {
			return arr.pop();
		}

		this.pop = pop;

/* --------------------------------------------------------------------------- */

		// indexOf

		function indexOf(arr, object, flag) {
			if(!(arr instanceof Array)) throw TypeError('Invalid argument!');
			if(flag) {
				for(var i = arr.length - 1; i >= 0; i--) {
					if(i in arr && arr[i] === object) {
						return i;
					}
				}
			}
			else {
				for(var i = 0, l = arr.length; i < l; i++) {
					if(i in arr && arr[i] === object) {
						return i;
					}
				}
			}
			return -1;
		}

		this.indexOf = indexOf;

		// each

		function each(arr, fn, thisObj) {
			for(var i = 0, l = arr.length; i < l; i++) {
				if(i in arr) {
					if(fn.call(thisObj, arr[i], i, arr)) {
						break;
					}
				}
			}
		}

		this.each = each;

		// map

		function map(arr, fn, thisObj) {
			var result = new Array(arr.length);
			for(var i = 0, l = arr.length; i < l; i++) {
				if(i in arr) {
					result[i] = fn.call(thisObj, arr[i], i, arr);
				}
			}
			return result;
		}

		this.map = map;

		// filter

		function filter(arr, fn, thisObj) {
			var result = [];
			for(var i = 0, l = arr.length; i < l; i++) {
				if(i in arr && fn.call(thisObj, arr[i], i, arr)) {
					result.push(arr[i]);
				}
			}
			return result;
		}

		this.filter = filter;

		//every

		function every(arr, fn, thisObj) {
			for(var i = 0, l = arr.length; i < l; i++) {
				if(i in arr && !fn.call(thisObj, arr[i], i, arr)) {
					return false;
				}
			}
			return true;
		}

		this.every = every;

		// some

		function some(arr, fn, thisObj) {
			for(var i = 0, l = arr.length; i < l; i++) {
				if(i in arr && fn.call(thisObj, arr[i], i, arr)) {
					return true;
				}
			}
			return false;
		}

		this.some = some;

		// to array

		function toArraySimple(obj) {

			var type = parent.type(obj);

			if(type.is(Array)) {
				return obj;
			}
			else if(type.is('object')) {
				if(obj.toArray && typeof obj.toArray === 'function') {
					return obj.toArray();
				}
				else if(obj.length !== undefined) {
					var arr = [];
					for(var i = 0, l = obj.length; i < l; i++) {
						arr.push(obj[i]);
					}
					return arr;
				}
				else {
					var arr = [];
					for(var prop in obj) {
						if(obj.hasOwnProperty(prop)) {
							arr.push(obj[prop]);
						}
					}
					return arr;
				}
			}
			else if(type.is('undefined') || type.is('null') || type.is('unknown')) {
				return [];
			}

			return [obj];
		}

		this.toArray = function() {
			var l = arguments.length;
			if(l > 1) {
				var M = [];
				for(var i = 0; i < l; i++) {
					M = M.concat(toArraySimple(arguments[i]));
				}
				return M;
			}
			else {
				return toArraySimple(arguments[0]);
			}
		};

	};

}


//~ <component>
//~	Name: Ynumber
//~	Info: Provide number helpers
//~ </component>

function ReeNumber() {

	this.num = new function() {

		this.limit = function(num, a, b) {
			if(b === undefined) {
				return num;
			}
			var min = Math.min(a, b), max = Math.max(a, b);
			return Math.min(max, Math.max(min, num));
		};

		this.toInt = function(num, base) {
			return parseInt(num, base || 10);
		};

		this.toFloat = function(num) {
			return parseFloat(num);
		};

		this.isInt = function(num) {
			return typeof num === 'number' && num % 1 === 0;
		};

		this.isFloat = function(num) {
			return typeof num === 'number' && num % 1 !== 0;
		};

		this.rand = function(num) {
			return Math.round(num * Math.random());
		};

		this.toRad = function(num) {
			return num * Math.PI / 180;
		};

		this.toDeg = function(num) {
			return num * 180 / Math.PI;
		};

	};

}


//~ <component>
//~	Name: Ystring
//~	Info: Provide string helpers
//~ </component>

function ReeString() {

	this.str = new function() {

		// is mail

		var mailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

		function isMail(str) {
			return !!~str.search(mailReg);
		}

		this.isMail = isMail;

		// has word

		function hasWord(str, word) {
			if(str.search('\\b' + word + '\\b') === -1) {
				return false;
			}
			return true;
		};

		this.hasWord = hasWord;

		// camel case

		function camelCase(str) {
			return str.replace(/-\D/g, function(match) {
				return match.charAt(1).toUpperCase();
			});
		};

		this.camelCase = camelCase;

		// to number

		function toNumber(str) {
			return ~str.indexOf('.') ? str.toFloat() :  str.toInt();
		};

		this.toNumber = toNumber;

		// get colors

		function tenBasedColor(str) {
			if(str.length === 1) {
				str += str;
			}
			return ree.num.limit(ree.num.toInt(str, 16), 0, 255);
		}

		function getColors(str) {
			var M;
			if(str.charAt(0) === '#') {
				if(str.length === 4) {
					M = str.match(/\w/g);
				}
				else {
					M = str.match(/\w{2}/g);
				}
				if(M.length === 3) {
					M = ree.arr.map(M, tenBasedColor);
				}
				else {
					throw Error('Incorrect input string!');
				}
			}
			else {
				M = str.match(/\d{1,3}/g);
				if(M) {
					M = ree.arr.map(M, function(c) {
						return ree.num.limit(ree.num.toInt(c), 0, 255);
					});

				}
			}
			return M || [];
		};

		this.getColors = getColors;

		// to rgb

		function toRgb(str) {
			var colors = this.getColors(str);
			if(colors.length === 3) {
				return 'rgb(' + colors.join(', ') + ')';
			}
			return false;
		};

		this.toRgb = toRgb;

		// to hex

		function toHex(str) {
			var colors = this.getColors(str);
			console.log(colors);
			if(colors.length === 3) {
				return '#' + ree.arr.map(colors, function(c) {
					var color = c.toString(16);
					return (color.length === 1) ? '0' + color : color;
				}).join('');
			}
			return false;
		};

		this.toHex = toHex;

		// trim

		function trim(str, chars) {
			str = ree.str.ltrim(str, chars);
			str = ree.str.rtrim(str, chars);
			return str;
		};

		this.trim = trim;

		// ltrim

		function ltrim(str, chars) {
			chars = chars || '\\s';
			return str.replace(new RegExp('^[' + chars + ']+', 'g'), '');
		};

		this.ltrim = ltrim;

		// rtrim

		function rtrim(str, chars) {
			chars = chars || '\\s';
			return str.replace(new RegExp('[' + chars + ']+$', 'g'), '');
		};

		this.rtrim = rtrim;

		// random string

		function random(n) {
			var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
				res = '',
				n = n ? n : 8,
				i = 0;

			for(; i < n; i++) {
				res += chars.charAt(Math.floor(Math.random() * chars.length));
			}

			return res;
		};

		this.random = random;

		// at

		function at(str, i) {
			return str.charAt(i);
		}

		this.at = at;

	};

}


//~ <component>
//~	Name: Yfunction
//~	Info: Provide function helpers
//~ </component>


function ReeFunction() {

	this.fn = new function() {

		function defer(fn, delay, context) {

			var args = Array.prototype.slice(arguments, 2);

			return setTimeout(function() {
				fn.apply(context, args);
			}, delay);
		}

		this.defer = defer;

	};

}


	ReeType.call(this);
	ReeObject.call(this);
	ReeArray.call(this);
	ReeNumber.call(this);
	ReeString.call(this);
	ReeFunction.call(this);

	$.hash = 'redjs_' + $.str.random(14);


//~ <component>
//~	Name: Functions List Object
//~	Info: Provides functions list encapsulator
//~ </component>


function FuncListProto() {

	this.init = function(params, obj) {
		this.calls++;
		$.arr.each(this.list, function(c) {
			c.apply(obj, params || []);
		});
		return this;
	};

	this.add = function(func) {
		if($.type(func).is(Function)) {
			$.arr.append(this.list, func);
		}
		return this;
	};

	this.del = function(func, flag) {
		var n = $.arr.indexOf(this.list, func);
		if(flag) {
			while(~n) {
				$.arr.del(this.list, n);
				n = $.arr.indexOf(this.list, func);
			}
		}
		else {
			$.arr.del(this.list, n);
		}
		return this;
	};

	this.clean = function() {
		this.list = [];
	};

}

function FuncList() {
	this.calls = 0;
	this.list = [];
}

FuncList.prototype = new FuncListProto;

//~ <component>
//~	Name: Functions List Object
//~	Info: Provides functions list encapsulator
//~ </component>


$.funcList = function() {
	return new FuncList();
};

//~ <component>
//~	Name: Deferred object
//~	Info: Deferred object module
//~ </component>


function DeferredProto() {

	this.resolve = function(params, context) {
		if(this.status == -1) {
			this.status = 1;
			this.context = context;
			this.params = params || [];
			this.successList.init(this.params, this.context);
			this.anywayList.init(this.params, this.context);
		}
	};

	this.reject = function(params, context) {
		if(this.status == -1) {
			this.status = 0;
			this.context = context;
			this.params = params || [];
			this.errorList.init(this.params, this.context);
			this.anywayList.init(this.params, this.context);
		}
	};

	this.success = function(func) {
		if(this.status == -1) {
			this.successList.add(func);
		}
		else if(this.status === 1) {
			func.apply(this.context, this.params);
		}
		return this;
	};

	this.error = function(func) {
		if(this.status == -1) {
			this.errorList.add(func);
		}
		else if(this.status === 0) {
			func.apply(this.context, this.params);
		}
		return this;
	};

	this.anyway = function(func) {
		if(this.status == -1) {
			this.anywayList.add(func);
		}
		else {
			func.apply(this.context, this.params);
		}
		return this;
	};

}

function Deferred() {

	this.status = -1;
	this.errorList = new FuncList();
	this.successList = new FuncList();
	this.anywayList = new FuncList();

}

Deferred.prototype = DeferredProto;


//~ <component>
//~	Name: Deferred object API
//~	Info: Deferred object module API
//~ </component>


$.deferred = function() {
	return new Deferred();
};


//~ <component>
//~	Name: List of Deferred Objects
//~	Info: List of deferred objects module
//~ </component>

// no code for now

//~ <component>
//~	Name: List of Deferred Objects API
//~	Info: List of deferred objects module API
//~ </component>

// no code for now


//~ <component>
//~	Name: Data Injection Object
//~	Info: Data injection object module
//~ </component>


function DataInjectionObjectProto() {

	this.data = function(obj, name, val) {
		if(obj) {
			var key = obj[this.hash];
			if(val === undefined)  {
				if(key !== undefined) {
					return this.cache[key][name];
				}
			}
			else {
				if(val === null) {
					delete this.cache[key][name];
				}
				else {
					if(key === undefined) {
						this.hookCache(obj);
					}
					this.cache[obj[this.hash]][name] = val;
					return val;
				}
			}
		}
	};

	this.hookCache = function(obj) {
		obj[this.hash] = this.next++;
		this.cache[obj[this.hash]] = {};
	};

	this.provideData = function(obj, name, value) {
		var dataObj = this.data(obj, name);
		if(dataObj === undefined) {
			return this.data(obj, name, value);
		}
		return dataObj;
	};

	this.provideDataObj = function(obj, name) {
		return this.provideData(obj, name, {});
	};

}

function DataInjectionObject(hash) {

	this.hash = hash;
	this.next = 0;
	this.cache = {};

}

DataInjectionObject.prototype = new DataInjectionObjectProto();


//~ <component>
//~	Name: Data Injection Object API
//~	Info: Data injection object module API
//~ </component>


$.getDataInjectionObject = function(hash) {
	return new DataInjectionObject(hash);
};

$._defaultDataInstance = $.getDataInjectionObject($.hash);

$.data = function(obj, name, val) {
	return $._defaultDataInstance.data(obj, name, val);
};

$.provideData = function(obj, name, value) {
	return $._defaultDataInstance.provideData(obj, name, value);
};

$.provideDataObj = function(obj, name) {
	return $._defaultDataInstance.provideDataObj(obj, name);
};



//~ <component>
//~	Name: Events Basics
//~	Info: Events basics module
//~ </component>


function EventsControllerProto() {

	this.on = function(obj, name, fn) {
		var event = this.data.provideData(obj, name, $.funcList());
		event.add(fn);
	};

	this.off = function(obj, name, fn) {
		var event = this.data.provideData(obj, name, $.funcList());
		event.del(fn);
	};

	this.force = function(obj, name, params) {
		var event = this.data.provideData(obj, name, $.funcList());
		event.init([name].concat(params));
	};

	this.clean = function(obj, name) {
		var event = this.data.provideData(obj, name, $.funcList());
		event.clean();
	};

}

function EventsController(name) {

	name = name ? name : 'events';
	this.data = new DataInjectionObject(name + '___' + $.hash);

}

EventsController.prototype = new EventsControllerProto();


//~ <component>
//~	Name: Events Basics API
//~	Info: Events basics module API
//~ </component>


$.getEventsController = function(name) {
	return new EventsController(name);
};



//~ <component>
//~	Name: Observer Object API
//~	Info: Implementation of observer pattern API
//~ </component>


$.observer = function(obj, recursiveFlag) {
	return new Observer(obj, recursiveFlag);
};

//~ <component>
//~	Name: Observer Object
//~	Info: Implementation of observer pattern
//~ </component>


function ObserverProto() {

	this.on = function(prop, event, fn) {
		return this._e.on(this._instance, [prop, event].join(':'), fn);
	};

	this.off = function(prop, event, fn) {
		return this._e.off(this._instance,  [prop, event].join(':'), fn);
	};

	this.set = function(prop, val) {
		this._e.force(this._instance, [prop, 'changing'].join(':'));
		this._instance[prop] = val;
		this._e.force(this._instance, [prop, 'changed'].join(':'));
		return val;
	};

	this.get = function(name) {
		return  this._instance[name];
	};

	this.instance = function(instance) {
		if(instance) {
			this._instance = instance;
		}
		return this._instance;
	};

}

function Observer(obj) {
	this._instance = obj;
	this._e = $.getEventsController();
}

Observer.prototype = new ObserverProto();

//~ <component>
//~	Name: Stack API
//~	Info: Implementation of stack API
//~ </component>


$.stack = function() {
	return new Stack();
};

//~ <component>
//~	Name: Stack
//~	Info: Implementation of stack
//~ </component>


function StackProto() {

	this.add = function(obj) {
		$.arr.append(this.stack, obj);
		this.length++;
		return this;
	};

	this.pop = function() {
		if(this.length) {
			this.length--;
			return $.arr.pop(this.stack);
		}
	};

	this.eq = function(n) {
		return this.stack[n]
	};

	this.last = function() {
		return $.arr.last(this.stack);
	};

	this.lastVal = function(val) {
		var lastIndex = this.lastIndex();
		if(~lastIndex) {
			this.stack[lastIndex] = val;
		}
	};

	this.lastIndex = function() {
		return $.arr.lastIndex(this.stack);
	};
	
}

function Stack() {

	this.stack = [];
	this.length = 0;

}

Stack.prototype = new StackProto();


//~ <component>
//~	Name: String Iterator API
//~	Info: Implementation of string iterator API
//~ </component>


$.stringIterator = function(str) {
	return new StringIterator(str);
};

//~ <component>
//~	Name: String Iterator
//~	Info: Implementation of string iterator
//~ </component>


function StringIteratorProto() {

	this.next = function() {
		this.index++;
	};

	this.prev = function() {
		this.index--;
	};

	this.char = function(index) {
		if(index) {
			return $.str.at(this.string, index);
		}
		else {
			return $.str.at(this.string, this.index);
		}
	};

	this.getPrevChar = function() {
		return this.char(this.index - 1);
	};

	this.prevCharIs = function(prevCh) {
		return ~this.getPrevChar().search(prevCh);
	};

	this.getNextChar = function() {
		return this.char(this.index + 1);
	};

	this.nextCharIs = function(nextCh) {
		return ~this.getNextChar().search(nextCh);
	};

}

function StringIterator(str) {

	this.string = str;
	this.index = 0;

}

StringIterator.prototype = new StringIteratorProto();




//~ <component>
//~	Name: XJSON
//~	Info: eXtended JSON Shemas
//~ </component>



//~ <component>
//~	Name: XJSON
//~	Info: eXtended JSON Shemas
//~ </component>


function _XjsonsParser() {

	this.createToken = function(type, prop) {

		if(type === 'array' || type === 'arr-template') {
			prop.value = [];
		}
		else if(type === 'object' || type === 'obj-template') {
			prop.value = {};
		}

		prop.type = type;
		prop.xjsonsToken = true;

		return prop;

	};

	this.propertyParser = function() {

		var	firstCh,
			propName = firstCh = this.iterator.char(),
			match;

		while(this.iterator.nextCharIs(/[\w()<>|]/)) {
			propName += this.iterator.getNextChar();
			this.iterator.next();
		}

		match = propName.match(/(\w+)?\((\w+)\)/);

		if(match) {
			return {
				inputProp: match[1] || match[2],
				outputProp: match[2]
			};
		}
		else {
			if(firstCh == '<') {
				match = propName.match(/[^<|>]+/g);
				if(match) {
					return {
						property: true,
						modificator: match[1],
						outputProp: match[0]
					};
				}
				else {
					throw SyntaxError("XJSONS: Non valid property literal!");
				}
			}
			else {
				throw SyntaxError("XJSONS: Non valid property literal!");
			}
		}

	};

	this.lastStackObject = function() {

		var last = this.contextStack.last();
		if(typeof last === 'number') {
			last = {};
		}
		return last;

	};

	this.iniValByStackProp = function(val) {

		var	inst = this.xjsons,
			lastIndex = this.contextStack.lastIndex(),
			last = this.contextStack.last();

		last = typeof last === 'object' ? last.outputProp : last;

		$.arr.each(this.contextStack.stack, function(c, i) {
			if(i === lastIndex) {
				return;
			}
			c = typeof c === 'object' ? c.outputProp : c;

			inst = inst[c];
			if(inst.xjsonsToken && inst.value) {
				inst = inst.value;
			}
		});

		inst[last] = val;

	};

	this.parse = function() {

		// ini

		this.xjsons = {};
		this.contextStack.add({outputProp: 'xjsons', type: 'object'});

		// parsers

		for(; this.ch = this.iterator.char(); this.iterator.next()) {

			if(this.ch === '{' && this.iterator.nextCharIs('%')) {

				this.iterator.next(); // skip %
				this.iniValByStackProp(this.createToken('obj-template', this.lastStackObject()));
				this.status = 'prop';

			}
			else if(this.ch === '{') {

				this.iniValByStackProp(this.createToken('object', this.lastStackObject()));
				this.status = 'prop';

			}
			else if(this.ch === '[' &&  this.iterator.nextCharIs('%')) {

				this.iterator.next(); // skip %
				this.iniValByStackProp(this.createToken('arr-template', this.lastStackObject()));
				this.contextStack.add(0);
				this.status = 'value';

			}
			else if(this.ch === '[') {

				this.iniValByStackProp(this.createToken('array', this.lastStackObject()));
				this.contextStack.add(0);
				this.status = 'value';

			}
			else if(this.ch === ']') {
				this.contextStack.pop();
			}
			else if(this.ch === '%' && this.iterator.nextCharIs(']')) {

				this.iterator.next(); // skip ]
				this.contextStack.pop();

			}
			else if(this.ch === '%' && this.iterator.nextCharIs('}')) {

				this.iterator.next(); // skip }

				var last = this.contextStack.last();
				if(typeof last === 'object') {
					this.contextStack.pop();
				}

			}
			else if(this.ch === '}') {

				var last = this.contextStack.last();
				if(typeof last === 'object') {
					this.contextStack.pop();
				}

			}
			else if(this.ch === ':') {

				this.status = 'value';

			}
			else if(this.ch === ',') {

				var last = this.contextStack.last();
				if(typeof last === 'object') {
					this.status = 'prop';
				}
				else {
					this.status = 'value';
					this.contextStack.lastVal(this.contextStack.last() + 1);
				}

			}
			else if(~this.ch.search(/\s/)) {
				// continue
			}
			else {
				if(this.status === 'value') {

					// value (simple type)

					var embeddedFlag = this.ch,
						last = this.contextStack.last(),
						lastObj = this.lastStackObject();

					while(this.iterator.nextCharIs(/[\w()]/)) {
						embeddedFlag += this.iterator.getNextChar();
						this.iterator.next();
					}

					lastObj.value = embeddedFlag;

					this.iniValByStackProp(this.createToken('embedded', lastObj));

					if(typeof last === 'object') {
						this.contextStack.pop();
					}

				}
				else if(this.status === 'prop') {

					this.contextStack.add(this.propertyParser());

				}
			}

		}

		return this.xjsons;
	};

}

function XjsonsParser(str) {

	this.iterator = new StringIterator(str);
	this.contextStack = new Stack();
	this.status = 'value';  // value | prop
	this.xjsons = undefined;
	this.ch = undefined;

}

XjsonsParser.prototype = new _XjsonsParser();


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


//~ <component>
//~	Name: XJSONS Api
//~	Info: API file of xjsons
//~ </component>


$.xjsons = function(str) {
	return new XjsonsParser(str);
};

$.xjsonsProcessor = function(schema, obj) {
	return new XjsonsProcessor(schema, obj);
};



};