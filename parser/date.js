"use strict";

exports.parse = function parseDate(str)
{
	return new Date(str);
}

exports.is = function isDate(obj)
{
	return obj instanceof Date;
}

exports.stringify = function stringifyDate(val)
{
	return val.getTime();
}
