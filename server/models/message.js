const mongoose = require('mongoose');
var Schema =   mongoose.Schema;

var messageSchema = new Schema({
    by: String,
    room: { type: mongoose.Types.ObjectId, ref: 'Room' },
    message: String,
    time: { type: Date, default: Date.now() }
});

messageSchema.statics.addMessage = function(msg, cb) {
    let m = this(msg);
    m.save(function(err, res) {
        cb(res);
    });
}

messageSchema.statics.getMessages = function(room, cb) {
    const q = room ? {room: room} : {}
    const s = room ? {time: 'asc'} : {time: 'desc'}
    mongoose.model('Message')
    .find(q)
    .sort(s)
    .populate('room', {name: 1})
    .exec((err, res) => {
        cb(res);
    })
}

messageSchema.statics.deleteMessage = function(msg, cb) {
    mongoose.model('Message')
    .remove({'_id': msg}, function(err) {
        cb(err);
    })
}

messageSchema.statics.deleteAll = function(room, cb) {
    mongoose.model('Message')
    .remove({room: room}, function(err) {
        cb(err);
    })
}

messageSchema.statics.deleteUser = function(user, cb) {
    mongoose.model('Message')
    .remove({'by': user}, (err) => {
        cb(err);
    })
}

module.exports = mongoose.model('Message', messageSchema);