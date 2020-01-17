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

let redis = require('redis'); 
let fakeredis = require('fakeredis')
//let redisDB = (config.redis.db && config.redis.db > 0) ? config.redis.db : 0;
/*global.redisClient = redis.createClient(config.redis.port, config.redis.host, {
    db: redisDB,
    auth_pass: config.redis.auth
});
*/
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
        afterEach(() => {
            sinon.restore()
        })
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
	let stub = null
        let balances = {"TRTLv2Fyavy8CXG8BPEbNeCHFZ1fuDCYCZ3vW5H5LXN4K2M2MHUpTENip9bbavpHvvPwb4NDkBWrNgURAd5DB38FHXWZyoBh4w": 1234}
        let minPayoutLevel = {"TRTLv2Fyavy8CXG8BPEbNeCHFZ1fuDCYCZ3vW5H5LXN4K2M2MHUpTENip9bbavpHvvPwb4NDkBWrNgURAd5DB38FHXWZyoBh4w":1000}
        data = JSON.stringify({"destinations":[{"amount":1198,"address":"TRTLv2Fyavy8CXG8BPEbNeCHFZ1fuDCYCZ3vW5H5LXN4K2M2MHUpTENip9bbavpHvvPwb4NDkBWrNgURAd5DB38FHXWZyoBh4w"}],"feePerByte":2,"unlock_time":0,"mixin":3})
        let endpoint = '/transactions/prepare/advanced'

	beforeEach(() => {
	    stub = sinon.stub(apiInterfaces, 'jsonHttpRequest')
	})
	afterEach(() => {
	    sinon.restore()
        })

        it("Should send correct parameters to 'apiInterfaces.jsonHttpRequest'", () => {
	    //ARRANGE
            //sinon.stub(apiInterfaces, 'jsonHttpRequest').callsFake(function(host, port, data, callback, path) {return callback(null, {})})
	    stub.callsFake(function(host, port, data, callback, path) {return callback(null, {})})	

	    //ACT
            paymentProcessors['turtlecoin'](balances, minPayoutLevel, callback)

	    //ASSERT
            expect(apiInterfaces.jsonHttpRequest).to.have.been.calledWith(config.wallet.host, config.wallet.port, data, sinon.match.any, endpoint)
        })

	it("Should log on error from 'apiInterfaces.jsonHttpRequest'", () => {
            //ARRANGE
	    let error = { "errorCode": 5,"errorMessage": "The password given for this wallet is incorrect."}
	    let result = null
	    
            //sinon.stub(apiInterfaces, 'jsonHttpRequest').callsFake(function(host, port, data, callback, path) {return callback(error, result)})
	    stub.callsFake(function(host, port, data, callback, path) {return callback(error, result)})
	    sinon.stub(global, 'log')
            //ACT
            paymentProcessors['turtlecoin'](balances, minPayoutLevel, callback)

            //ASSERT
            expect(apiInterfaces.jsonHttpRequest).to.have.been.calledWith(config.wallet.host, config.wallet.port, data, sinon.match.any, endpoint)
	    expect(global.log).to.have.been.calledWith("error", "payments - turtlecoin", "Error with /transactions/prepare/advanced request to WalletApi, The password given for this wallet is incorrect.")
        })
    })
    describe('doit', () =>{
	before(() => {
	    sinon.stub(redis, 'createClient').callsFake( fakeredis.createClient);
	    global.redisClient = redis.createClient()
	})
	after(() => {
	    redis.createClient.restore();
 	 });

  	afterEach((done) => {
	    global.redisClient.flushdb(function(err){
    	    	done();
   	    });
	})

        it("Should create hincrby for `TurtleCoin:workers:TRTLv2Fyavy8CXG8BPEbNeCHFZ1fuDCYCZ3vW5H5LXN4K2M2MHUpTENip9bbavpHvvPwb4NDkBWrNgURAd5DB38FHXWZyoBh4w` balance from 'apiInterfaces.jsonHttpRequest'", () => {
            //ARRANGE
            let error = null
            let endpoint = '/transactions/prepare/advanced'

            let balances = {"TRTLv2Fyavy8CXG8BPEbNeCHFZ1fuDCYCZ3vW5H5LXN4K2M2MHUpTENip9bbavpHvvPwb4NDkBWrNgURAd5DB38FHXWZyoBh4w": 1234}
            let minPayoutLevel = {"TRTLv2Fyavy8CXG8BPEbNeCHFZ1fuDCYCZ3vW5H5LXN4K2M2MHUpTENip9bbavpHvvPwb4NDkBWrNgURAd5DB38FHXWZyoBh4w":1000}
            let result = {"transactionHash": "396e2a782c9ce9993982c6f93e305b05306d0e5794f57157fbac78581443c55f","fee": 1000,"relayedToNetwork": false}

	    let blah = [ [ 'hincrby',
    'TurtleCoin:workers:TRTLv2Fyavy8CXG8BPEbNeCHFZ1fuDCYCZ3vW5H5LXN4K2M2MHUpTENip9bbavpHvvPwb4NDkBWrNgURAd5DB38FHXWZyoBh4w',
    'balance',
    -1198 ],
  [ 'hincrby',
    'TurtleCoin:workers:TRTLv2Fyavy8CXG8BPEbNeCHFZ1fuDCYCZ3vW5H5LXN4K2M2MHUpTENip9bbavpHvvPwb4NDkBWrNgURAd5DB38FHXWZyoBh4w',
    'balance',
    -1000 ],
  [ 'hincrby',
    'TurtleCoin:workers:TRTLv2Fyavy8CXG8BPEbNeCHFZ1fuDCYCZ3vW5H5LXN4K2M2MHUpTENip9bbavpHvvPwb4NDkBWrNgURAd5DB38FHXWZyoBh4w',
    'paid',
    NaN ],
  [ 'zadd',
    'TurtleCoin:payments:all',
    1579233769,
    '396e2a782c9ce9993982c6f93e305b05306d0e5794f57157fbac78581443c55f:0:1000:0:1' ],
  [ 'zadd',
    'TurtleCoin:payments:TRTLv2Fyavy8CXG8BPEbNeCHFZ1fuDCYCZ3vW5H5LXN4K2M2MHUpTENip9bbavpHvvPwb4NDkBWrNgURAd5DB38FHXWZyoBh4w',
    1579233769,
    '396e2a782c9ce9993982c6f93e305b05306d0e5794f57157fbac78581443c55f:1198:1000:0' ] ]

	    
	    sinon.spy(global.redisClient, 'multi')
	    sinon.stub(apiInterfaces, 'jsonHttpRequest').callsFake(function(host, port, data, callback, path) {return callback(null, result)})

            //ACT
            paymentProcessors['turtlecoin'](balances, minPayoutLevel, callback)

            //ASSERT
            expect(apiInterfaces.jsonHttpRequest).to.have.been.calledWith(config.wallet.host, config.wallet.port, data, sinon.match.any, endpoint)
	
	    expect(global.redisClient.multi.called).to.equal(true)
        })
/*
        it("Should create hincrby for `TurtleCoin:workers:TRTLv2Fyavy8CXG8BPEbNeCHFZ1fuDCYCZ3vW5H5LXN4K2M2MHUpTENip9bbavpHvvPwb4NDkBWrNgURAd5DB38FHXWZyoBh4w` paid from 'apiInterfaces.jsonHttpRequest'", () => {
            //ARRANGE
            let error = null
            let result = {"transactionHash": "396e2a782c9ce9993982c6f93e305b05306d0e5794f57157fbac78581443c55f","fee": 1000,"relayedToNetwork": false}

            //sinon.stub(apiInterfaces, 'jsonHttpRequest').callsFake(function(host, port, data, callback, path) {return callback(null, null)})
	    stub.callsFake(function(host, port, data, callback, path) {return callback(null, null)})

            //ACT
            paymentProcessors['turtlecoin'](balances, minPayoutLevel, callback)

            //ASSERT
            expect(apiInterfaces.jsonHttpRequest).to.have.been.calledWith(config.wallet.host, config.wallet.port, data, sinon.match.any, endpoint)
        })
*/
    })
})
