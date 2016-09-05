var Database = require('./database.js').Database;

module.exports = function() {
    var orderCollectionSingleton = null;
    var OrderCollectionFactory = function() {

        if (orderCollectionSingleton !== null) {
            return orderCollectionSingleton;
        }
        orderCollectionSingleton = { };
        orderCollectionSingleton.collection = Database('order');

        orderCollectionSingleton.add = function(order) {
            return orderCollectionSingleton.collection.then(function(collection) {
                return collection.insert(order, {
                    w: 1
                });
            }).then(function(resultset) {
                return resultset.ops[0];
            }).catch(function() {
                return {
                    code: 500,
                    message: 'An error occurred while creating an order.'
                };
            });
        };
        return orderCollectionSingleton;
    };
    return {
        OrderCollection: OrderCollectionFactory
    };
}();