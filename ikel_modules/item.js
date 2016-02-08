var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

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
 * TODO: item description
 */
module.exports = function () {

    var mongoUri = null;

    var create = function (item) {
        return new Promise(function (fulfill, reject) {
            if (isEmpty(item.name)) {
                reject({
                    code: 400,
                    message: 'Item name not specified. Please specify a non-empty item name.'
                });
                return;
            }
            if (isEmpty(item.author)) {
                reject({
                    code: 400,
                    message: 'Author\'s name not specified. Please specify a non-empty name for the person who wants this item.'
                });
                return;
            }
            if (isEmpty(item.price)) {
                reject({
                    code: 400,
                    message: 'Price not specified. Please specify a non-empty price for this item.'
                });
                return;
            }
            MongoClient.connect(mongoUri, function (error1, db) {
                processMongoError(error1, reject, function () {
                    db.collection('orders', function (error2, ordersCollection) {
                        processMongoError(error2, reject, function () {
                            ordersCollection.findOne({
                                _id: new ObjectId(item._order)
                            }, function (error, data) {
                                if (error) {
                                    reject({
                                        code: 500,
                                        message: 'An error occurred while accessing the database'
                                    });
                                } else if (!data) {
                                    reject({
                                        code: 404,
                                        message: 'Could not find the specified order'
                                    });
                                } else {
                                    db.collection('items', function (error4, itemsCollection) {
                                        processMongoError(error4, reject, function () {
                                            itemsCollection.save(item, {
                                                w: 1
                                            }, function (error5, rs) {
                                                processMongoError(error5, reject, function () {
                                                    db.close();
                                                    fulfill(rs[0]);
                                                });
                                            });
                                        });
                                    });
                                }
                            });
                        });
                    });

                });
            });
        });
    };

    var update = function (id, item) {
        item._id = new ObjectId(id);      // Ensure we're updating the item with the correct id
        return create(item);
    };

    var remove = function (id) {
        return new Promise(function (fulfill, reject) {
            MongoClient.connect(mongoUri, function (err, db) {
                db.collection('items', function (er, collection) {
                    collection.remove({
                        _id: new ObjectId(id)
                    }, function (error, data) {
                        if (data.result.n === 0) {
                            reject({
                                code: 404,
                                message: 'Could not find the specified item to delete'
                            });
                            return;
                        }
                        db.close();
                        fulfill();
                    });
                });
            });
        });
    };

    var lookup = function (id) {
        return new Promise(function (fulfill, reject) {
            MongoClient.connect(mongoUri, function (err, db) {
                db.collection('items', function (er, collection) {
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

    var query = function (query) {
        return new Promise(function (fulfill, reject) {
            if (!query || !query.order) {
                reject({
                    code: 501,
                    message: 'The current implementation does not support arbitrary queries for items. Make sure that your items request ' +
                            'contains the "order" query parameter.'
                });
                return;
            }
            MongoClient.connect(mongoUri, function (err, db) {
                processMongoError(err, reject, function () {
                    db.collection('items', function (er, collection) {
                        processMongoError(er, reject, function () {
                            collection.find({
                                _order: query.order
                            }).toArray(function (error, results) {
                                processMongoError(error, reject, function () {
                                    db.close();
                                    if (error) {
                                        reject({
                                            code: 500,
                                            message: 'An error occurred while accessing the database'
                                        });
                                    } else {
                                        fulfill(results);
                                    }
                                });
                            });
                        });
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
            
            // When this module binds, create some indices in the database
            MongoClient.connect(mongoUri, function (error1, db) {
                processMongoError(error1, function() {}, function () {
                    db.collection('items', function (error4, itemsCollection) {
                        itemsCollection.ensureIndex({ _order: 1 });
                        db.close();
                    });
                });
            });
            
            app.post('/item', function (req, res) {
                create(req.body).then(function (item) {
                    res.send(item);
                }, function (error) {
                    console.log('Error while creating a new item', error);
                    res.send(error.code, error.message);
                });
            });
            app.post('/item/:id', function (req, res) {
                update(req.params.id, req.body).then(function (item) {
                    res.send(item);
                }, function (error) {
                    console.log('Error while creating a new item', error);
                    res.send(error.code, error.message);
                });
            });
            app.delete('/item/:id', function (req, res) {
                remove(req.params.id).then(function () {
                    res.send();
                }, function (error) {
                    console.log('Error while deleting an item', error);
                    res.send(error.code, error.message);
                });
            });
            app.get('/item', function (req, res) {
                query(req.query).then(function (items) {
                    res.send(items);
                }, function (error) {
                    console.log('Error while querying items', error);
                    res.send(error.code, error.message);
                });
            });
            app.get('/item/:id', function (req, res) {
                lookup(req.params.id).then(function (item) {
                    res.send(item);
                }, function (error) {
                    console.log('Error while looking up an item', error);
                    res.send(error.code, error.message);
                });
            });
        }
    };

}();
