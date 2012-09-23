
//~ <component>
//~	Name: Observer Object API
//~	Info: Implementation of observer pattern API
//~ </component>


$.observer = function(obj, recursiveFlag) {
	return new Observer(obj, recursiveFlag);
};
