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
		it('#stringify', function()
		{
			var err = new Error('errmsg');
			err.errcode = -202;

			var data1 = jk.stringify(err);
			expect(data1.k).to.be('Error');
			expect(data1.v.message).to.be(err.message);
			expect(data1.v.errcode).to.be(err.errcode);
			expect(data1.v.stack).to.be.an('array');
			expect(data1.v.stack).not.contain('Error: errmsg');
			expect(data1.v.stack[0]).to.contain(__dirname);
			expect(data1.v.stack[0]).to.contain(__filename);
			

			var data2 = jk.stringify({key: err});

			expect(data2.key.k).to.be('Error');
			expect(data2.key.v.message).to.be(err.message);
			expect(data2.key.v.errcode).to.be(err.errcode);
			expect(data2.key.v.stack).to.be.an('array');
			expect(data2.key.v.stack).not.contain('Error: errmsg');
			expect(data2.key.v.stack[0]).to.contain(__dirname);
			expect(data2.key.v.stack[0]).to.contain(__filename);
		});


		it('#parse', function()
		{
			var err = {
				k: 'Error',
				v:
				{
					message: 'errmsg',
					errcode: -202,
					stack: ['stack1', 'stack2']
				}
			};

			var data1 = jk.parse(err);
			expect(data1).to.be.an(Error);
			expect(data1.message).to.be('errmsg');
			expect(data1.errcode).to.be(-202);
			expect(data1.stack).to.be.a('string');
			expect(data1.stack).to.contain('Error: errmsg')
				.contain('Original Stack');


			var data2 = jk.parse({key: err});
			expect(data2.key).to.be.an(Error);
			expect(data2.key.message).to.be('errmsg');
			expect(data2.key.errcode).to.be(-202);
			expect(data2.key.stack).to.be.a('string');
			expect(data2.key.stack).to.contain('Error: errmsg')
				.contain('Original Stack');
		});

	});


	describe('#regexp', function()
	{
		var reg = /\..[1-4]*?$/ig;
		assertTranslate(reg, {k: 'RegExp', v:reg.toString()});
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
