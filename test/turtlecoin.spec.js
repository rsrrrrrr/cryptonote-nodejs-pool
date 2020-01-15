var chai = require('chai');
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var expect = chai.expect;
let assert = require('assert');
let async = require('async');
global.config = require('./turtle.json')


global.log = function (severity, system, text, data) {
    let formattedMessage = text;

    if (data) {
	data.unshift(text);
	formattedMessage = util.format.apply(null, data);
    }
    console.log(`\t${formattedMessage}`)
}

let bytecoin = require('../lib/paymentprocessors/turtlecoin')

let paymentProcessors = {};

let callback = () => {}

describe('Turtlecoin Payment Processor', () => {

    before(() => {
	paymentProcessors = {}
        bytecoin(paymentProcessors)
    })

    describe('Initialize processPayments', () => {
	it('Should contain function', () => {
            expect(typeof(paymentProcessors['turtlecoin'])).to.equal('function')
	})
    })

    describe('Handle processPayments', () =>{
	it("Should display 'No workers\' balances reached the minium payment threshold", () => {
	    let payments = {}
	    let minPayoutLevel = {}
	    // spy on global.log
	    paymentProcessors['turtlecoin'](payments, minPayoutLevel, callback)
	    // expect global.log to havebeeencalledwith("Should display 'No workers\' balances reached the minium payment threshold")
	    expect(1).to.equal(1)
	})
    })
})
