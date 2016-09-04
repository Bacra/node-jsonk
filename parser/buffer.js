"use strict";

exports.parse = function parseBuffer(str)
{
	return Buffer(str, 'base64');
}

exports.is = function isBuffer(obj)
{
	return Buffer.isBuffer(obj);
}

exports.stringify = function stringifyBuffer(val)
{
	return val.toString('base64');
}
