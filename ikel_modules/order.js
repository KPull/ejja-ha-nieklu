var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var Database = require('./database.js').Database;

var isEmpty = function (text) {
    return !text || text === '';
};

var processMongoError = function (error, reject, then) {
    if (error) {
        console.log('An error occurred while accessing the database', error);
        reject({
            code: 500,
            message: 'An error occurred while accessing the database'
        });
    } else {
        then();
    }
};

/**
 * An order represents an intended purchase from a food establishment. For example,
 * a group of friends might want to buy a meal together so they would open an Order
 * where they can add items they want to buy.
 */
module.exports = function () {

    var mongoUri = null;

    var create = function (order) {
        if (!order.from || !order.from.name) {
            return Promise.reject({
                code: 400,
                message: 'Restaurant name not specified. Please specify a non-empty restaurant name.'
            });
        }
        if (isEmpty(order.author)) {
            return Promise.reject({
                code: 400,
                message: 'Author\'s name not specified. Please specify a non-empty name for the person opening this order.'
            });
        }
        if (isEmpty(order.email)) {
            return Promise.reject({
                code: 400,
                message: 'E-mail not specified. Please specify a non-empty e-mail for this order.'
            });
        }
        return Database('orders').then(function(collection) {
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

    var remove = function (id) {
        return new Promise(function (fulfill, reject) {
            MongoClient.connect(mongoUri, function (err, db) {
                db.collection('orders', function (er, collection) {
                    processMongoError(er, reject, function () {
                        collection.remove({
                            _id: new ObjectId(id)
                        }, function (error, data) {
                            if (data.result.n === 0) {
                                reject({
                                    code: 404,
                                    message: 'Could not find the specified order to delete'
                                });
                                return;
                            }
                            db.collection('items', function (er, collection) {
                                collection.remove({
                                    _order: new ObjectId(id)
                                }, function () {
                                    db.close();
                                    fulfill();
                                });
                            });
                        });
                    });
                });
            });
        });
    };

    var getAll = function () {
        return new Promise(function (fulfill, reject) {
            MongoClient.connect(mongoUri, function (err, db) {
                processMongoError(err, reject, function () {
                    db.collection('orders', function (er, collection) {
                        processMongoError(er, reject, function () {
                            collection.find().toArray(function (error, results) {
                                processMongoError(error, reject, function () {
                                    db.close();
                                    fulfill(results);
                                });
                            });
                        });
                    });
                });
            });
        });
    };
    
    var lookup = function (id) {
        return new Promise(function (fulfill, reject) {
            MongoClient.connect(mongoUri, function (err, db) {
                db.collection('orders', function (er, collection) {
                    collection.findOne({
                        _id: new ObjectId(id)
                    }, function (error, data) {
                        db.close();
                        if (error) {
                            reject({
                               code: 500,
                               message: 'An error occurred while accessing the database'
                            });
                        } else if (!data) {
                            reject({
                                code: 404,
                                message: 'Could not find the specified item'
                            });
                        } else {
                            fulfill(data);
                        }
                    });
                });
            });
        });
    };

    return {
        /**
         * Register our API endpoints on the specified express application and using
         * the specified database
         */
        bind: function (app, mongo, io) {
            mongoUri = mongo;
            app.post('/order', function (req, res) {
                create(req.body).then(function (order) {
                    io.emit('new_order', order);
                    res.send(order);
                }, function (error) {
                    console.log('Error while creating a new order', error);
                    res.send(error.code, error.message);
                });
            });
            app.delete('/order/:id', function (req, res) {
                remove(req.params.id).then(function () {
                    io.emit('closed_order', req.params.id);
                    res.send();
                }, function (error) {
                    console.log('Error while deleting an order', error);
                    res.send(error.code, error.message);
                });
            });
            app.get('/order', function(req, res) {
                getAll().then(function (orders) {
                    res.send(orders);
                }, function (error) {
                    console.log('Error while deleting an order', error);
                    res.send(error.code, error.message);
                });
            });
            app.get('/order/:id', function(req, res) {
                lookup(req.params.id).then(function (orders) {
                    res.send(orders);
                }, function (error) {
                    console.log('Error while fetching an order', error);
                    res.send(error.code, error.message);
                });
            });
        }
    };

}();
