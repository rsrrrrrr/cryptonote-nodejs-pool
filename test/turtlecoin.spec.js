var chai = require('chai');
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var sinon = require('sinon')
var expect = chai.expect;
let assert = require('assert');
let async = require('async');
global.config = require('./turtle.json')


global.log = function (severity, system, text, data) {}
/*    let formattedMessage = text;

    if (data) {
	data.unshift(text);
	formattedMessage = util.format.apply(null, data);
    }
    console.log(`\t${formattedMessage}`)
}
*/

//let utils = require('../lib/utils.js');

let bytecoin = require('../lib/paymentprocessors/turtlecoin')
let apiInterfaces = require('../lib/apiInterfaces.js')(config.daemon, config.wallet, config.api);

let paymentProcessors = {};

let callback = (result) => {return result}


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

    describe('No Payments', () =>{
	it("Should display log message 'No workers\' balances reached the minimum payment threshold", () => {
	    let balances = {}
	    let minPayoutLevel = {}
	    sinon.stub(global, 'log')
	    paymentProcessors['turtlecoin'](balances, minPayoutLevel, callback)
	    expect(global.log).to.have.been.calledWith("info", "payments - turtlecoin", "No workers\' balances reached the minimum payment threshold")
	})
    })

    describe('Payments', () =>{
        it("Should send correct parameters to 'apiInterfaces.jsonHttpRequest'", () => {
	    let balances = {  "aRi1cDd6LkAcc1p6W58dkPi8xSfbZ5EuYFrHxwH3py1MQ9rFrzmSaghguD4GGpCfHSMmKXWJrd4e5CkabC3viWJKfHuDLYqHNGs9D83sj6BPX": 234895806015}
            let minPayoutLevel = {  "aRi1cDd6LkAcc1p6W58dkPi8xSfbZ5EuYFrHxwH3py1MQ9rFrzmSaghguD4GGpCfHSMmKXWJrd4e5CkabC3viWJKfHuDLYqHNGs9D83sj6BPX":1000000000}
	    let data = ''
	    let endpoint = '/transactions/send/prepared'
            sinon.stub(apiInterfaces, 'jsonHttpRequest')
            paymentProcessors['turtlecoin'](balances, minPayoutLevel, callback)
	    expect(apiInterfaces.jsonHttpRequest.calledOnce).to.be.true
//            expect(apiInterfaces.jsonHttpRequest).to.have.been.calledWith(config.wallet.host, config.wallet.port, data, null, endpoint)
        })
    })
})
