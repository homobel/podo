
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
