
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