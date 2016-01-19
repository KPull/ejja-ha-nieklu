// web.js
'use strict';

var express = require('express');
var logfmt = require('logfmt');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var Order = require('./ikel_modules/order.js');
var Item = require('./ikel_modules/item.js');

var MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID;

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||
  'mongodb://localhost/ejja-ha-nieklu';

app.use(cors());
app.use(logfmt.requestLogger());

app.use(bodyParser());

app.use(express.static(__dirname + '/webapp/dist'));

var port = Number(process.env.PORT || 5000);
var server = app.listen(port, function() {
  if (process.send) {
    process.send('LISTENING_STARTED');
  }
  console.log("Listening on " + port);
});
var io = require('socket.io').listen(server);

// Create the e-mail transport object
var transport = nodemailer.createTransport("SMTP", {
  service: "Gmail",
  auth: {
    user: process.env.MAILER_USERNAME,
    pass: process.env.MAILER_PASSWORD
  }
});

app.get('/item', function(req, res) {
  MongoClient.connect(mongoUri, function(err, db) {
    db.collection('items', function(er, collection) {
      collection.find({
        _order: req.query.order
      }).toArray(function(error, result) {
        res.send(result);
        db.close();
      });
    });
  });
});

app.get('/order', function(req, res) {
  MongoClient.connect(mongoUri, function(err, db) {
    db.collection('orders', function(er, collection) {
      collection.find().toArray(function(error, results) {
        res.send(results);
        db.close();
      });
    });
  });
});

app.get('/order/:id', function(req, res) {
  MongoClient.connect(mongoUri, function(err, db) {
    var orders = db.collection('orders');
    orders.findOne({
      _id: new ObjectId(req.params.id)
    }, function(error, results) {
      res.send(results);
      db.close();
    });
  });
});

Order.bind(app, mongoUri, io);
Item.bind(app, mongoUri, io);