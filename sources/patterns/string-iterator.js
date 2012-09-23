
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

