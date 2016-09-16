"use strict";

var expect = require('expect.js');
var jk = require('../');
var JSONK = jk.JSONK;


describe('#base', function()
{
	describe('#base type', function()
	{
		var baseData = {
			string: 'string',
			number: 11,
			boolean: true,
			nuLL: null,
			undef: undefined,
			array: ['string', 11, true, {number: 33}, undefined],
			object: {number: 22}
		};

		it('#stringify', function()
		{
			expect(jk.stringify(baseData)).to.be.eql(
				{
					jsonk_data: baseData
				});

			for(var i in baseData)
			{
				if (baseData.hasOwnProperty(i))
				{
					expect(jk.stringify(baseData[i]))
						.to.be.eql(
						{
							jsonk_data: baseData[i]
						});
				}
			}
		});

		it('#parse', function()
		{
			expect(jk.parse({jsonk_data: baseData})).to.be.eql(baseData);

			for(var i in baseData)
			{
				if (baseData.hasOwnProperty(i))
				{
					expect(jk.parse({jsonk_data: baseData[i]})).to.be.eql(baseData[i]);
				}
			}
		});

	});

	describe('#use parse', function()
	{
		var now = Date.now();
		var baseData = {
			jsonk_data: {k: 'Date', v: now},
			parsers: 'Date'
		};

		it('#base', function()
		{
			expect(jk.parse(baseData).getTime()).to.be(now);
		});

		it('#noparser', function()
		{
			delete baseData.parsers;
			expect(jk.parse(baseData)).to.be.eql(baseData.jsonk_data);
		});

		it('#parseNoWrap', function()
		{
			expect(jk.parseNoWrap(baseData.jsonk_data).getTime()).to.be(now);
		});

		it('#parseType', function()
		{
			expect(jk.parseType('Date', now).getTime()).to.be(now);
		});

		it('#outparser', function()
		{
			expect(function()
				{
					expect(jk.parse({jsonk_data: {}, parsers: 'not_exists_parser'}));
				})
				.to.throwError(function(e)
				{
					expect(e.message).to.be('Miss Parser,not_exists_parser');
				});
		});

	});


	it('#escape', function()
	{
		expect(jk.stringify({k: '\\', v: {}}))
			.to.be.eql({jsonk_data: {k: '\\', v: {k: '\\', v: {}}}});
	});



	it('#stringifyToString', function()
	{
		expect(jk.stringifyToString({string: 'string'}))
			.to.be("{ jsonk_data: { string: 'string' } }");
	});


	it('#parseFromString', function()
	{
		expect(jk.parseFromString('{"jsonk_data":{"string": "string"}}'))
			.to.be.eql({string: 'string'});

		expect(jk.parseFromString("{jsonk_data:{string: 'string'}}"))
			.to.be.eql({string: 'string'});
	});
});
