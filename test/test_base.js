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
		expect(jk.stringify(baseData)).to.be.eql(
			{
				data: baseData
			});

		for(var i in baseData)
		{
			if (baseData.hasOwnProperty(i))
			{
				expect(jk.stringify(baseData[i]))
					.to.be.eql(
					{
						data: baseData[i]
					});
			}
		}
	});

	it('#escape', function()
	{
		expect(jk.stringify({k: '\\', v: {}}))
			.to.be.eql({data: {k: '\\', v: {k: '\\', v: {}}}});
	});


	it('#parse', function()
	{
		expect(jk.parse({data: baseData})).to.be.eql(baseData);

		for(var i in baseData)
		{
			if (baseData.hasOwnProperty(i))
			{
				expect(jk.parse({data: baseData[i]})).to.be.eql(baseData[i]);
			}
		}
	});


	it('#stringifyToString', function()
	{
		expect(jk.stringifyToString({string: 'string'}))
			.to.be("{ data: { string: 'string' } }");
	});


	it('#parseFromString', function()
	{
		expect(jk.parseFromString('{"data":{"string": "string"}}'))
			.to.be.eql({string: 'string'});

		expect(jk.parseFromString("{data:{string: 'string'}}"))
			.to.be.eql({string: 'string'});
	});

	describe('#stringify wrap info', function()
	{
		it('#noparser', function()
		{
			var now = Date.now();
			expect(jk.parse({data: {k: 'Date', v: now}}))
				.to.be.eql({k: 'Date', v: now});
		});


		it('#outparser', function()
		{
			expect(function()
				{
					expect(jk.parse({data: {}, parsers: 'not_exists_parser'}));
				})
				.to.throwError(function(e)
				{
					expect(e.message).to.be('Miss Parser,not_exists_parser');
				});
		});
	});
});
