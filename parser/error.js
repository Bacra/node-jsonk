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

	err.stack += ['Original ====']
		.concat(data.stack)
		.join('\t\n');

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
