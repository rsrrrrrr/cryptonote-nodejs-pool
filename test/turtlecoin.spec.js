let expect    = require('chai').expect;
let assert = require('assert');
let async = require('async');

global.config = require('../config_examples/turtle.json')

let bytecoin = require('../lib/paymentprocessors/turtlecoin')



describe('Turtlecoin Payment Processor', function() {
	it('should', function() {
		expect(1).to.equal(1)
	})
})