
//~ <component>
//~	Name: Podo Lib
//~	Info: Second abstraction level for redjs
//~ </component>


if(this.podo === undefined) {

	this.podo = new function() {

//~ require: podo-init.js

	};

}
else {
	throw Error('podo init error -  property already present in ' + this.toString());
}
