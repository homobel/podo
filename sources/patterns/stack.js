
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

