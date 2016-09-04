"use strict";

var Stringify = require('./stringify').Stringify;
var Parse = require('./parse').Parse;

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
	var strify = new Stringify(this);
	return strify.handle(data);
};

proto.parse = function(data)
{
	var parse = new Parse(this);
	return parse.handle(data);
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
