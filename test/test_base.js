"use strict";

var expect = require('expect.js');
var JSONK = require('../');

describe('#base', function()
{
	it('#stringify', function()
	{
		var jk = new JSONK();
		var data = {
			string: 'string',
			number: 11,
			boolean: true,
			nuLL: null,
			undef: undefined,
			array: ['string', 11, true, {number: 33}, undefined],
			object: {number: 22}
		};

		expect(jk.stringify(data)).to.be.eql(data);

		for(var i in data)
		{
			if (data.hasOwnProperty(i))
			{
				expect(jk.stringify(data[i])).to.be.eql(data[i]);
			}
		}
	});

	it('#escape', function()
	{
		var jk = new JSONK();
		expect(jk.stringify({k: '\\', v: {}}))
			.to.be.eql({k: '\\', v: {k: '\\', v: {}}});
	});
});
