"use strict";

var expect = require('expect.js');
var jk = require('../');

describe('#parser', function()
{
	describe('#date', function()
	{
		var now = new Date;
		assertTranslate(now, {k: 'Date', v: +now});
	});

	describe('#buffer', function()
	{
		var buf = Buffer('123key');
		assertTranslate(buf, {k: 'Buffer', v:buf.toString('base64')});
	});


	describe('#error', function()
	{
		var err = new Error('errmsg');
		var output = {};
		err.errcode = output.errcode = -202;
		output.message = 'errmsg';
		var stack = err.stack.split(/\n\s*/);
		stack.shift();
		output.stack = stack;

		assertTranslate(err, {k: 'Error', v: output});
	});
});

function assertTranslate(data1, data2)
{
	it('#stringify', function()
	{
		expect(jk.stringify(data1)).to.be.eql(data2);
		expect(jk.stringify({key: data1})).to.be.eql({key: data2});
	});

	it('#parse', function()
	{
		expect(jk.parse(data2)).to.be.eql(data1);
		expect(jk.parse({key: data2})).to.be.eql({key: data1});
	});
}
