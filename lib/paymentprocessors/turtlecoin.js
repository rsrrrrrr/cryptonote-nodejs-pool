function processPayments(balances, minPayoutLevel, callback) {
    console.log('make turtlecoin payments');
    callback(balances, minPayoutLevel)
}

module.exports = function(module_holder) {
    // the key in this dictionary can be whatever you want
    // just make sure it won't override other modules
    module_holder['turtlecoin'] = processPayments;
};