"use strict";

var expect = require('expect.js');
var jk = require('../');
var JSONK = jk.JSONK;
var baseData = {
	string: 'string',
	number: 11,
	boolean: true,
	nuLL: null,
	undef: undefined,
	array: ['string', 11, true, {number: 33}, undefined],
	object: {number: 22}
};

describe('#base', function()
{
	it('#stringify', function()
	{
		expect(jk.stringify(baseData)).to.be.eql(baseData);

		for(var i in baseData)
		{
			if (baseData.hasOwnProperty(i))
			{
				expect(jk.stringify(baseData[i])).to.be.eql(baseData[i]);
			}
		}
	});

	it('#escape', function()
	{
		expect(jk.stringify({k: '\\', v: {}}))
			.to.be.eql({k: '\\', v: {k: '\\', v: {}}});
	});


	it('#parse', function()
	{
		expect(jk.parse(baseData)).to.be.eql(baseData);

		for(var i in baseData)
		{
			if (baseData.hasOwnProperty(i))
			{
				expect(jk.parse(baseData[i])).to.be.eql(baseData[i]);
			}
		}
	});
});
