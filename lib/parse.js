function ParseHandler(jsonk, parsers, parsermap)
{
	this.jsonk = jsonk;
	this.parsers = parsers || jsonk.parsers;
	this.parsermap = parsermap || jsonk.parsermap;
}

var proto = ParseHandler.prototype;

proto.handle  = function(data)
{
	if (!data) return data;
	if (data.k == '\\')
	{
		return self.jsonk.map(data.v, function(item, key)
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
		var handler = self.parsermap[data.k];
		if (handler)
		{
			return handler.parse.call(handler, data.v, self);
		}
	}

	return self.jsonk.map(data, function(item, key)
		{
			return self.handle(item, self);
		});
};

exports.Parse = ParseHandler;
