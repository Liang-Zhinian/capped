'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');


require('./mongo-cursor')();

function start(db, collection, cb) {
    try {
        var collection = db.collection(collection);

        console.log('collection name: ' + collection.collectionName);
        collection.isCapped(function (err, capped) {
            if (err) {
                console.log('Error when detecting capped collection (' + collection.collectionName + ').  Aborting.  Capped collections are necessary for tailed cursors.');
                process.exit(1);
            }
            if (!capped) {
                console.log(collection.collectionName + ' is not a capped collection. Aborting.  Please use a capped collection for tailable cursors.');
                process.exit(2);
            }
            if (!!cb) {
                cb(collection);
            }
        });
    } catch (e) {
        new Error('my silly error');
        throw e;
    }
    return item;
}

module.exports.start = start;