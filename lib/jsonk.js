"use strict";

var util = require('util');
var vm = require('vm');
var Stringify = require('./stringify').Stringify;
var Parse = require('./parse').Parse;
var debug = require('debug')('jsonk:jsonk');

var inspectOptions = {
	depth: null,
	colors: false,
	showHidden: false,
	maxArrayLength: null,
	breakLength: Infinity
}

function JSONK()
{
	this.parsers = [];
	this.parsermap = {};
}

var proto = JSONK.prototype;

proto.map = function(list, handler)
{
	if (Array.isArray(list))
	{
		return list.map(handler);
	}
	else
	{
		var result = {};
		for(var i in list)
		{
			if (list.hasOwnProperty(i))
			{
				result[i] = handler(list[i], i);
			}
		}

		return result;
	}
};

proto.stringify = function(data)
{
	if (!data) return {jsonk_data: data};

	var stringify = new Stringify(this);
	var output = {jsonk_data: stringify.handle(data)};
	var listStr = Object.keys(stringify.used).join('|');
	if (listStr.length)
		output.parsers = listStr;
	else
		debug('no parsers for stringify');

	return output;
};


proto._getParseList = function(str)
{
	var self = this;
	var parsers = [];
	var parsermap = {};

	str && str.split('|').forEach(function(name)
	{
		var handler = self.parsermap[name];
		if (!handler) throw new Error('Miss Parser,'+name);

		parsers.push(handler);
		parsermap[name] = handler;
	});

	return {parsers: parsers, parsermap: parsermap};
};

proto.stringifyToString = function(data)
{
	var output = this.stringify(data);
	return util.inspect(output, inspectOptions);
};

proto.parse = function(data)
{
	if (!data) return data;

	var opts = this._getParseList(data.parsers);
	var parse = new Parse(this, opts.parsers, opts.parsermap);

	var output = parse.handle(data.jsonk_data);
	return output;
};

// 不指定parsers，直接使用所有绑定的parsers进行parse
proto.parseNoWrap = function(data)
{
	if (!data) return data;
	var parse = new Parse(this);
	return parse.handle(data);
};

proto.parseType = function(type, data)
{
	if (!data) return data;
	var parse = new Parse(this);
	var output = parse.handle({k: type, v: data});

	return parse.parsetimes ? output : data;
};

proto.parseFromString = function(str)
{
	var data = {};
	vm.runInNewContext('gb_data='+str, data);
	return this.parse(data.gb_data);
};

proto.addParser = function(name, handler)
{
	if (this.parsermap[name]) throw new Error('parser is exists,'+name);

	var parser = {
		name: name,

		is: handler.jsonk_is
			|| handler.is
			|| function(data) {return data instanceof handler},

		stringify: handler.jsonk_stringify
			|| handler.stringify
			|| handler.toJSON
			|| handler.toString,

		parse: handler.jsonk_parse
			|| handler.parse
			|| function(str){return new handler(str)}
	};

	this.parsermap[name] = parser;
	this.parsers.push(parser);
};


exports.JSONK = JSONK;
