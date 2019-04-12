const mongoose = require('mongoose');
var Schema =   mongoose.Schema;

var logSchema = new Schema({
    by: String,
    log: String,
    time: { type: Date, default: Date.now() }
});

logSchema.statics.addLog = function(log, cb) {
    if (!log)
        return cb(null);
    let m = this(log);
    m.save(function(err, res) {
        cb(res);
    });
}

logSchema.statics.getLogs = function(cb) {
    mongoose.model('Log')
    .find({})
    .sort({time: 'desc'})
    .exec((err, res) => {
        cb(res);
    })
}

module.exports = mongoose.model('Log', logSchema);