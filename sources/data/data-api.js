
//~ <component>
//~	Name: Data Injection Object API
//~	Info: Data injection object module API
//~ </component>


$._defaultDataInstance = new DataInjectionObject($.hash);

$.data = function(obj, name, val) {
	return $._defaultDataInstance.data(obj, name, val);
};

$.provideData = function(obj, name, value) {
	return $._defaultDataInstance.provideData(obj, name, value);
};

$.provideDataObj = function(obj, name) {
	return $._defaultDataInstance.provideDataObj(obj, name);
};
