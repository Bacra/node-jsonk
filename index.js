"use strict";

var JSONK = require('./lib/jsonk').JSONK;

var jk = exports = module.exports = new JSONK();
exports.JSONK = JSONK;

jk.addParser('Date', require('./parser/date'));
jk.addParser('Buffer', require('./parser/buffer'));
jk.addParser('Error', require('./parser/error'));
