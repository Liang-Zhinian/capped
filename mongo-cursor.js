'use strict';

var mongo = require('mongodb');
var Cursor = mongo.Cursor;

// Duck-punching mongodb driver Cursor.each.  This now takes an interval that waits 
// "interval" milliseconds before it makes the next object request... 
module.exports = function() {

    Cursor.prototype.intervalEach = function (interval, callback) {
        var self = this;
        if (!callback) {
            throw new Error('callback is mandatory');
        }

        if (this.state !== Cursor.CLOSED) {
            //FIX: stack overflow (on deep callback) (cred: https://github.com/limp/node-mongodb-native/commit/27da7e4b2af02035847f262b29837a94bbbf6ce2)
            setTimeout(function () {
                // Fetch the next object until there is no more objects
                self.nextObject(function (err, item) {
                    // console.log('item: ');
                    //console.log(item);
                    if (err !== null) return callback(err, null);

                    if (item !== null) {
                        callback(null, item);
                        self.intervalEach(interval, callback);
                    } else {
                        // Close the cursor if done
                        self.state = Cursor.CLOSED;
                        callback(err, null);
                    }

                    item = null;
                });
            }, interval);
        } else {
            callback(new Error('Cursor is closed'), null);
        }
    };
};