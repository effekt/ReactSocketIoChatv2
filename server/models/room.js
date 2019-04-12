const mongoose = require('mongoose');
var Schema =   mongoose.Schema;
const Message = require('./message')

var roomSchema = new Schema({
    name: String
});

roomSchema.statics.addRoom = function(room, cb) {
    let r = this({name: room});
    r.save(function(err, res) {
        cb(res);
    });
}

roomSchema.statics.getRooms = function(cb) {
    mongoose.model('Room')
    .find({})
    .then((res) => {
        cb(res);
    });
}

roomSchema.statics.deleteRoom = function(room, cb) {
    Message.deleteAll(room, function(err) {
        mongoose.model('Room')
        .remove({'_id': room}, function(err) {
            cb(err);
        })
    })
}

module.exports = mongoose.model('Room', roomSchema);