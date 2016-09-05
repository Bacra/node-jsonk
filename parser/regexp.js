"use strict";

var regContent = /\/(.+)\/(\w*)/;

exports.parse = function parseRegExp(data)
{
	var m = data.match(regContent);
	return RegExp(m[1], m[2]);
}

exports.is = function isRegExp(obj)
{
	return obj instanceof RegExp;
}

exports.stringify = function stringifyRegExp(val)
{
	return val.toString();
}
