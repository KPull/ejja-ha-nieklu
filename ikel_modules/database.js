'use script';

var MongoClient = require('mongodb').MongoClient
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||
    'mongodb://localhost/ejja-ha-nieklu';

module.exports = function() {

    var Database = function(collectionName) {
        return MongoClient.connect(mongoUri).then(function(connection) {
            return Promise.resolve(connection.collection(collectionName));
        });
    }

    return {
        Database: Database
    };
}();