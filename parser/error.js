"use strict";

exports.parse = function parseError(data)
{
	var err = new Error(data.message);
	var stack = err.stack;

	for(var i in data)
	{
		if (i != 'message'
			&& i != 'stack'
			&& data.hasOwnProperty(i))
		{
			err[i] = data[i];
		}
	}

	var originalStack = data.stack.map(function(line)
		{
			if (line.substr(0, 3) == 'at ')
				return '    '+line;
			else
				return '\n'+line;
		});

	Object.defineProperty(err, 'stack',
		{
			value: err.stack + ['\n\n==== Original Stack ====\n']
				.concat(originalStack)
				.join('\n'),
			writable: false,
			enumerable: true,
			configurable: true
		});

	return err;
}

exports.is = function isError(obj)
{
	return obj instanceof Error;
}

exports.stringify = function stringifyError(val)
{
	var output = {};
	for(var i in val)
	{
		if (val.hasOwnProperty(i))
		{
			output[i] = val[i];
		}
	}

	output.message = val.message;
	var stack = val.stack.split(/\n\s*/);
	stack.shift();
	output.stack = stack;
	return output;
}
