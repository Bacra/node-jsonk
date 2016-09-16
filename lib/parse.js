"use strict";

function ParseHandler(jsonk, parsers, parsermap)
{
	this.jsonk = jsonk;
	this.parsetimes = 0;
	this.parsers = parsers || jsonk.parsers;
	this.parsermap = parsermap || jsonk.parsermap;
}

var proto = ParseHandler.prototype;

proto.handle  = function(data)
{
	this.parsetimes = 0;
	return this.parse(data);
};


proto.parse  = function(data)
{
	if (!data) return data;

	var self = this;
	if (data.k == '\\')
	{
		self.parsetimes++;
		return self.jsonk.map(data.v, function(item, key)
			{
				return self._parseWidthoutUnescape(item);
			});
	}
	else
	{
		return self._parseWidthoutUnescape(data);
	}
};

proto._parseWidthoutUnescape = function(data)
{
	var self = this;
	if (!data || typeof data != 'object') return data;

	if (data.k)
	{
		var handler = self.parsermap[data.k];
		if (handler)
		{
			self.parsetimes++;
			return handler.parse.call(handler, data.v, self);
		}
	}

	return self.jsonk.map(data, function(item, key)
		{
			return self.parse(item, self);
		});
};

exports.Parse = ParseHandler;
