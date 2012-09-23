
//~ <component>
//~	Name: XJSONS Api
//~	Info: API file of xjsons
//~ </component>


$.xjsons = function(str) {
	return new XjsonsParser(str);
};

$.xjsonsProcessor = function(schema, obj) {
	return new XjsonsProcessor(schema, obj);
};