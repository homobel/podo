
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
	this._e = $.eventsController();
}

Observer.prototype = new ObserverProto();
