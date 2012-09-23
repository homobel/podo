
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
