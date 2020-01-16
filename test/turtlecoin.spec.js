var chai = require('chai');
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var sinon = require('sinon')
var expect = chai.expect;
let assert = require('assert');
let async = require('async');
global.config = require('./turtle.json')

global.log = function (severity, system, text, data) {}

//let utils = require('../lib/utils.js');

let bytecoin = require('../lib/paymentprocessors/turtlecoin')
let apiInterfaces = require('../lib/apiInterfaces.js')

let paymentProcessors = {}

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
	    //ARRANGE
	    let balances = {}
	    let minPayoutLevel = {}
	    sinon.stub(global, 'log')
	
	    //ACT
	    paymentProcessors['turtlecoin'](balances, minPayoutLevel, callback)

	    //ASSERT
	    expect(global.log).to.have.been.calledWith("info", "payments - turtlecoin", "No workers\' balances reached the minimum payment threshold")
	})
    })

    describe('Prepare payments', () =>{
        it("Should send correct parameters to 'apiInterfaces.jsonHttpRequest'", () => {
	    //ARRANGE
	    let balances = {  "aRi1cDd6LkAcc1p6W58dkPi8xSfbZ5EuYFrHxwH3py1MQ9rFrzmSaghguD4GGpCfHSMmKXWJrd4e5CkabC3viWJKfHuDLYqHNGs9D83sj6BPX": 234895806015}
            let minPayoutLevel = {  "aRi1cDd6LkAcc1p6W58dkPi8xSfbZ5EuYFrHxwH3py1MQ9rFrzmSaghguD4GGpCfHSMmKXWJrd4e5CkabC3viWJKfHuDLYqHNGs9D83sj6BPX":1000000000}
	    data = JSON.stringify({"destinations":[{"amount":100000000,"address":"aRi1cDd6LkAcc1p6W58dkPi8xSfbZ5EuYFrHxwH3py1MQ9rFrzmSaghguD4GGpCfHSMmKXWJrd4e5CkabC3viWJKfHuDLYqHNGs9D83sj6BPX"}],"feePerByte":50,"unlock_time":0})
	    let endpoint = '/transactions/prepare/advanced'
            sinon.stub(apiInterfaces, 'jsonHttpRequest').callsFake(function(host, port, data, callback, path) {return callback(null, {})})

	    //ACT
            paymentProcessors['turtlecoin'](balances, minPayoutLevel, callback)

	    //ASSERT
            expect(apiInterfaces.jsonHttpRequest).to.have.been.calledWith(config.wallet.host, config.wallet.port, data, sinon.match.any, endpoint)
        })
    })
})
