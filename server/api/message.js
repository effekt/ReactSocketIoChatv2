const Message = require('../models/message');
const Room = require('../models/room');

module.exports = function(app){
    let endpoint = "/api/message";

    app.post(endpoint, function(req, res){
        Message.addMessage(req.body, (r) => {
            res.json(r)
        });
    });

    app.get(endpoint + "/:room", function(req, res) {
        Message.getMessages(req.params.room, (r) => {
            res.json(r);
        });
    });

    app.get(endpoint, function(req, res) {
        Message.getMessages(null, (r) => {
            res.json(r);
        })
    })

    app.get(endpoint + '/del/:id', function(req, res) {
        Message.deleteMessage(req.params.id, (r) => {
            res.json(r);
        })
    })
}