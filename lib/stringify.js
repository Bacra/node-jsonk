"use strict";

function StringifyHandler(jsonk, parsers, parsermap)
{
	this.jsonk = jsonk;
	this.parsers = parsers || jsonk.parsers;
	this.parsermap = parsermap || jsonk.parsermap;
}

var proto = StringifyHandler.prototype;

proto.handle = function(data)
{
	this.used = {};
	var output = this.parse(data);
	return output;
};

proto.parse = function(data)
{
	var self = this;
	if (!data || typeof data != 'object') return data;

	var result;
	self.parsers.some(function(handler)
	{
		if (handler.is.call(handler, data))
		{
			self.used[handler.name] = true;
			result = self.jsonk.formatItem(
					handler.name,
					self.escape(handler.stringify.call(handler, data, self))
				);

			return true;
		}
	});

	if (result) return result;

	var result = self.jsonk.map(data, function(item, key)
		{
			return self.parse(item);
		});

	return self.escape(result);
};


proto.escape = function(obj)
{
	if (obj && obj.k)
	{
		if (this.parsermap[obj.k]
			|| obj.k == '\\')
		{
			return this.jsonk.formatItem('\\', obj);
		}
	}

	return obj;
};

exports.Stringify = StringifyHandler;
