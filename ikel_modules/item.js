var MongoClient = require('mongodb').MongoClient
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
            MongoClient.connect(mongoUri, function (error1, db) {
                processMongoError(error1, reject, function () {
                    db.collection('items', function (error2, collection) {
                        processMongoError(error2, reject, function () {
                            collection.insert(item, {
                                w: 1
                            }, function (error3, rs) {
                                processMongoError(error3, reject, function () {
                                    db.close();
                                    fulfill(rs.ops[0]);
                                });
                            });
                        });
                    });
                });
            });
        });
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

    return {
        /**
         * Register our API endpoints on the specified express application and using
         * the specified database
         */
        bind: function (app, mongo, io) {
            mongoUri = mongo;
            app.post('/item', function (req, res) {
                create(req.body).then(function (item) {
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
            app.get('/item/:id', function (req, res) {
                lookup(req.params.id).then(function(item) {
                    res.send(item);
                }, function(error) {
                    console.log('Error while looking up an item', error);
                    res.send(error.code, error.message);
                })
            });
        }
    };

}();
