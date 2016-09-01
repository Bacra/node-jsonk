"use strict";

function JsonK()
{
	this.parsers = [];
	this._parsermap = {};
}

var proto = JsonK.prototype;

proto.each = function(list, isarr, handler)
{
	if (isarr)
	{
		list.forEach(handler);
	}
	else
	{
		for(var i in list)
		{
			if (list.hasOwnProperty(i))
			{
				handler(list[i], i);
			}
		}
	}
};

proto.stringify = function(data)
{
	var self = this;
	if (!data || typeof data != 'object') return data;

	var result;
	self.parsers.some(function(handler)
	{
		if (handler.is(item))
		{
			result = {
				k: handler.name,
				v: self.escape(handler.stringify(item, self))
			};

			return true;
		}
	});

	if (result) return result;

	var isarr = Array.isArray(data);
	result = isarr ? [] : {};

	self.each(data, isarr, function(item, key)
	{
		result[key] = self.stringify(item);
	});

	return isarr ? result : self.escape(result);
};

proto.escape = function(obj)
{
	if (obj && obj.k && this._parsermap[obj.k])
	{
		return {
			k: 'escape',
			v: obj
		};
	}
	else
	{
		return obj;
	}
};

proto.unescape = function(obj)
{
	return obj && obj.k == 'escape' && obj.v ? obj.v : obj;
};

proto.parse  = function(data)
{
	return this._parseWidthoutUnescape(this.unescape(data));
}

proto._parseWidthoutUnescape = function(data)
{
	var self = this;
	if (!data || typeof data != 'object') return data;

	if (data.k && self._parsermap[data.k])
	{
		return self._parsermap[data.k].parse(self.unescape(data.v), self);
	}

	var isarr = Array.isArray(data);
	var result = isarr ? [] : {};

	self.each(data, isarr, function(item, key)
	{
		result[key] = self.parse(item, self);
	});

	return result;
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


module.exports = JsonK;
