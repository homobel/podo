
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
