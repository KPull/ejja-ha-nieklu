// web.js
'use strict';

var express = require('express');
var logfmt = require('logfmt');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

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

app.post('/order', function(req, res) {

  if (!req.body.from || !req.body.from.name) {
    res.status(400).send({
      error: 'Restaurant name not specified. Please specify a non-empty restaurant name.'
    });
    return;
  }

  MongoClient.connect(mongoUri, function(err, db) {
    db.collection('orders', function(er, collection) {
      collection.insert(req.body, {
        w: 1
      }, function(er, rs) {
        if (process.env.ORDER_ALERTS_TO) {
          // Send an e-mail if variable is set
          transport.sendMail({
            from: process.env.ORDER_ALERTS_FROM,
            to: process.env.ORDER_ALERTS_TO,
            subject: 'Ejja Ha Nieklu: Order Opened (' + req
              .body.from.name + ')',
            text: 'An order has been opened for ' + req.body
              .from.name +
              '. \r\nCheck it out over on the Ejja Ha Nieklu app on http://ejja-ha-nieklu.herokuapp.com/ :)'
          });
        }
        res.send(rs.ops[0]);
        io.emit('new_order', rs.ops[0]);
        db.close();
      });
    });
  });
});

var handleItemPost = function(req, res) {
  MongoClient.connect(mongoUri, function(err, db) {
    db.collection('items', function(er, collection) {
      collection.save(req.body, {
        w: 1
      }, function(er, rs) {
        res.send(rs.ops[0]);
        db.close();
      });
    });
  });
}

app.post('/item', function(req, res) {
  handleItemPost(req, res);
});

app.post('/item/:id', function(req, res) {
  // Make sure the id used in the URL is the same in the object
  req.body['_id'] = new ObjectId(req.params.id);

  handleItemPost(req, res)
});

app.delete('/item/:id', function(req, res) {
  MongoClient.connect(mongoUri, function(err, db) {
    db.collection('items', function(er, collection) {
      collection.remove({
        _id: new ObjectId(req.params.id)
      }, {
        w: 1
      }, function() {
        res.send();
        db.close();
      });
    });
  });
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

app.delete('/order/:id', function(req, res) {
  MongoClient.connect(mongoUri, function(err, db) {
    db.collection('orders', function(er, collection) {
      collection.remove({
        _id: new ObjectId(req.params.id)
      }, function() {
        db.collection('items', function(er, collection) {
          collection.remove({
            _order: new ObjectId(req.params.id)
          }, function() {
            io.emit('closed_order', req.params.id);
            res.send();
          });
        });
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

app.get('/pleas', function(req, res) {
  MongoClient.connect(mongoUri, function(err, db) {
    if (err) {
      console.error(err);
      req.send(500, err);
    }
    db.collection('pleas', function(er, collection) {
      var now = new Date();
      collection.find({
        timestamp: {
          $gte: new Date(now.getFullYear(), now.getMonth(), now
            .getDate(), 0, 0, 0, 0),
          $lte: new Date(now.getFullYear(), now.getMonth(), now
            .getDate(), 23, 59, 59, 999)
        }
      }).toArray(function(error, results) {
        res.send(results);
        db.close();
      });
    });
  });
});

app.post('/pleas', function(req, res) {
  MongoClient.connect(mongoUri, function(err, db) {
    if (err) {
      console.error(err);
      req.send(500, err);
    }
    db.collection('pleas', function(er, collection) {
      req.body.timestamp = new Date();
      collection.insert(req.body, {
        w: 1
      }, function(er, rs) {
        // in case nothing is returned
        var value = (!!rs ? null : rs[0]);
        res.send(value);
        db.close();
      });
    });
  });
});
