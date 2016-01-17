var MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID;

var isEmpty = function (text) {
    return !text || text === '';
};

/**
 * An order represents an intended purchase from a food establishment. For example,
 * a group of friends might want to buy a meal together so they would open an Order
 * where they can add items they want to buy.
 */
module.exports = function () {

    var mongoUri = null;

    var create = function (order) {
        return new Promise(function (fulfill, reject) {
            if (!order.from || !order.from.name) {
                reject({
                    code: 400,
                    message: 'Restaurant name not specified. Please specify a non-empty restaurant name.'
                });
                return;
            }
            if (isEmpty(order.author)) {
                reject({
                    code: 400,
                    message: 'Author\'s name not specified. Please specify a non-empty name for the person opening this order.'
                });
            }
            if (isEmpty(order.email)) {
                reject({
                    code: 400,
                    message: 'E-mail not specified. Please specify a non-empty e-mail for this order.'
                });
            }
            MongoClient.connect(mongoUri, function (err, db) {
                db.collection('orders', function (er, collection) {
                    collection.insert(order, {
                        w: 1
                    }, function (er, rs) {
                        if (process.env.ORDER_ALERTS_TO) {
                            // Send an e-mail if variable is set
                            transport.sendMail({
                                from: process.env.ORDER_ALERTS_FROM,
                                to: process.env.ORDER_ALERTS_TO,
                                subject: 'Ejja Ha Nieklu: Order Opened (' + order.from.name + ')',
                                text: 'An order has been opened for ' + order.from.name +
                                        '. \r\nCheck it out over on the Ejja Ha Nieklu app on http://ejja-ha-nieklu.herokuapp.com/ :)'
                            });
                        }
                        db.close();
                        fulfill(rs.ops[0]);
                    });
                });
            });
        });
    };

    var remove = function (id) {
        return new Promise(function (fulfill, reject) {
            MongoClient.connect(mongoUri, function (err, db) {
                db.collection('orders', function (er, collection) {
                    collection.remove({
                        _id: new ObjectId(id)
                    }, function () {
                        db.collection('items', function (er, collection) {
                            collection.remove({
                                _order: new ObjectId(id)
                            }, function () {
                                fulfill();
                            });
                        });
                    });
                });
            });
        });
    }

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
                });
            });
        }
    }

}();
