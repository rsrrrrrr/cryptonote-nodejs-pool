/**
 * Cryptonote Node.JS Pool
 * https://github.com/dvandal/cryptonote-nodejs-pool
 *
 * Payments processor
 **/

// Load required modules
let fs = require('fs');
let path = require('path');
let async = require('async');

let apiInterfaces = require('./apiInterfaces.js')(config.daemon, config.wallet, config.api);
let notifications = require('./notifications.js');
let utils = require('./utils.js');

// Initialize log system
let logSystem = 'payments';
require('./exceptionWriter.js')(logSystem);

/**
 * Run payments processor
 **/

log('info', logSystem, 'Started');

if (!config.poolServer.paymentId) config.poolServer.paymentId = {};
if (!config.poolServer.paymentId.addressSeparator) config.poolServer.paymentId.addressSeparator = "+";
if (!config.payments.priority) config.payments.priority = 0;

var paymentProcessors = {};

function initialize() {
	let dir = path.resolve(__dirname, 'paymentprocessors')
	fs.readdir(dir, (err, files) => {
		files.forEach(file => {
			require(path.resolve(dir, file))(paymentProcessors)
		})
	})
}

function runInterval () {
	async.waterfall([

        // Get worker keys
        function (callback) {
			redisClient.keys(config.coin + ':workers:*', function (error, result) {
				if (error) {
					log('error', logSystem, 'Error trying to get worker balances from redis %j', [error]);
					callback(true);
					return;
				}
				callback(null, result);
			});
        },

        // Get worker balances
        function (keys, callback) {
			let redisCommands = keys.map(function (k) {
				return ['hget', k, 'balance'];
			});
			redisClient.multi(redisCommands)
				.exec(function (error, replies) {
					if (error) {
						log('error', logSystem, 'Error with getting balances from redis %j', [error]);
						callback(true);
						return;
					}

					let balances = {};
					for (let i = 0; i < replies.length; i++) {
						let parts = keys[i].split(':');
						let workerId = parts[parts.length - 1];

						balances[workerId] = parseInt(replies[i]) || 0;
					}
					callback(null, keys, balances);
				});
        },

        // Get worker minimum payout
        function (keys, balances, callback) {
			let redisCommands = keys.map(function (k) {
				return ['hget', k, 'minPayoutLevel'];
			});
			redisClient.multi(redisCommands)
				.exec(function (error, replies) {
					if (error) {
						log('error', logSystem, 'Error with getting minimum payout from redis %j', [error]);
						callback(true);
						return;
					}

					let minPayoutLevel = {};
					for (let i = 0; i < replies.length; i++) {
						let parts = keys[i].split(':');
						let workerId = parts[parts.length - 1];

						let minLevel = config.payments.minPayment;
						let maxLevel = config.payments.maxPayment;
						let defaultLevel = minLevel;

						let payoutLevel = parseInt(replies[i]) || minLevel;
						if (payoutLevel < minLevel) payoutLevel = minLevel;
						if (maxLevel && payoutLevel > maxLevel) payoutLevel = maxLevel;
						minPayoutLevel[workerId] = payoutLevel;

						if (payoutLevel !== defaultLevel) {
							log('info', logSystem, 'Using payout level of %s for %s (default: %s)', [utils.getReadableCoins(minPayoutLevel[workerId]), workerId, utils.getReadableCoins(defaultLevel)]);
						}
					}
					callback(null, balances, minPayoutLevel);
				});
        },
        function (balances, minPayoutLevel, callback) {
        	paymentProcessors[config.daemonType](balances, minPayoutLevel, callback)
        }
    ], function (error, result) {
		setTimeout(runInterval, config.payments.interval * 1000);
	});
}

initialize();
runInterval();
