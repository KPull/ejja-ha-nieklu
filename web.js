// web.js
var express = require("express");
var logfmt = require("logfmt");
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');

var mongo = require('mongodb');
var BSON = mongo.BSONPure;

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL || '';


app.use(cors());
app.use(logfmt.requestLogger());

app.use(bodyParser());

app.get('/', function(req, res) {
  res.send('Hello World!');
});



app.post('/order', function(req, res) {
    mongo.Db.connect(mongoUri, function (err, db) {
      db.collection('orders', function(er, collection) {

        collection.insert(req.body, {safe: true}, function(er,rs) {
            res.send(rs[0]);
        });
      });
    });
});

app.post('/item', function(req, res) {
    mongo.Db.connect(mongoUri, function (err, db) {
      db.collection('items', function(er, collection) {

        collection.insert(req.body, {safe: true}, function(er,rs) {
            res.send(rs[0]);
        });
      });
    });
});

app.delete('/item/:id', function(req, res) {
    mongo.Db.connect(mongoUri, function (err, db) {
      db.collection('items', function(er, collection) {

        collection.remove({
           _id: new BSON.ObjectID(req.params.id)
        },function() {
          res.send();
        });
      });
    });
});

app.get('/item', function(req, res) {
    mongo.Db.connect(mongoUri, function (err, db) {
      db.collection('items', function(er, collection) {
        collection.find({
            _order : req.query.order
        }).toArray(function (error, result) {
            res.send(result);
        });
      });
    });
});

app.delete('/order/:id', function(req, res) {
    mongo.Db.connect(mongoUri, function (err, db) {
      db.collection('orders', function(er, collection) {
        collection.remove({
           _id: new BSON.ObjectID(req.params.id)
        },function() {
          db.collection('items', function(er, collection) {
            collection.remove({
               _order: req.params.id
            },function() {
              res.send();
            });
          });

        });
      });
    });
});


app.get('/order', function(req, res) {
    mongo.Db.connect(mongoUri, function (err, db) {
      db.collection('orders', function(er, collection) {
        collection.find().toArray(function(error, results) {
            res.send(results);
        });
      });
    });
});

app.get('/order/:id', function(req, res) {
    mongo.Db.connect(mongoUri, function (err, db) {
      db.collection('orders', function(er, collection) {
        collection.findOne({
           _id: new BSON.ObjectID(req.params.id)
        }, function(error, results) {
            res.send(results);
        });
      });
    });
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});