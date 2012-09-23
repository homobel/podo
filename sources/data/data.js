
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
