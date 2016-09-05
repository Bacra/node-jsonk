JSONK
==================

Common Extended JSON.

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![Dependencies][dependencies-image]][dependencies-url]
[![Build Status][travis-image]][travis-url]
[![Coveralls][coveralls-image]][coveralls-url]
[![NPM License][license-image]][npm-url]

# Install

```shell
npm install jsonk --save
```

# Useage

```javacript
var jk = require('jsonk');
var input = {
	string: 'string',
	number: 1111,
	buffer: new Buffer('123key')
};

var output = {
	data: {
		string: 'string',
		number: 1111,
		buffer: {
			k: 'Buffer',
			v: 'MTIza2V5'
		}
	}
};

jk.stringify(input);
jk.parse(output);
```


[npm-image]: http://img.shields.io/npm/v/jsonk.svg
[downloads-image]: http://img.shields.io/npm/dm/jsonk.svg
[dependencies-image]: http://img.shields.io/david/Bacra/node-jsonk.svg
[dependencies-url]: https://www.versioneye.com/nodejs/jsonk
[npm-url]: https://www.npmjs.org/package/jsonk
[travis-image]: http://img.shields.io/travis/Bacra/node-jsonk/master.svg
[travis-url]: https://travis-ci.org/Bacra/node-jsonk
[coveralls-image]: https://img.shields.io/coveralls/Bacra/node-jsonk.svg
[coveralls-url]: https://coveralls.io/github/Bacra/node-jsonk
[license-image]: http://img.shields.io/npm/l/jsonk.svg
