"use strict";

function JSONK()
{
	this.parsers = [];
	this._parsermap = {};
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
	return this._stringify(data);
};

proto._stringify = function(data)
{
	var self = this;
	if (!data || typeof data != 'object') return data;

	var result;
	self.parsers.some(function(handler)
	{
		if (handler.is.call(handler, data))
		{
			result = {
				k: handler.name,
				v: self.escape(handler.stringify.call(handler, data, self))
			};

			return true;
		}
	});

	if (result) return result;

	var result = self.map(data, function(item, key)
		{
			return self.stringify(item);
		});

	return this.escape(result);
};

proto.escape = function(obj)
{
	if (obj && obj.k)
	{
		if (this._parsermap[obj.k]
			|| obj.k == '\\')
		{
			return {
				k: '\\',
				v: obj
			};
		}
	}

	return obj;
};

proto.parse = function(data)
{
	return this._parse(data);
};

proto._parse  = function(data)
{
	if (!data) return data;
	if (data.k == '\\')
	{
		return self.map(data.v, function(item, key)
			{
				return self._parseWidthoutUnescape(item);
			});
	}
	else
	{
		return this._parseWidthoutUnescape(data);
	}
};

proto._parseWidthoutUnescape = function(data)
{
	var self = this;
	if (!data || typeof data != 'object') return data;

	if (data.k)
	{
		var handler = self._parsermap[data.k];
		if (handler)
		{
			return handler.parse.call(handler, data.v, self);
		}
	}

	return self.map(data, function(item, key)
		{
			return self._parse(item, self);
		});
};

proto.addParser = function(name, handler)
{
	if (this._parsermap[name]) throw new Error('parser is exists,'+name);

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

	this._parsermap[name] = parser;
	this.parsers.push(parser);
};


module.exports = JSONK;
