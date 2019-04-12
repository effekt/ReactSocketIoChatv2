const Room = require('../models/room');

module.exports = function(app){
    let endpoint = "/api/room";

    app.get(endpoint + "/get", function(req, res){
        Room.getRooms((rooms) => {
            res.json(rooms);
        });
    });

    app.get(endpoint + "/add/:room", function(req, res) {
        Room.addRoom(req.params.room, (r) => {
            res.json(r)
        });
    });

    app.get(endpoint + "/del/:room", function(req, res) {
        Room.deleteRoom(req.params.room, (r) => {
            res.json(r);
        })
    })

    app.post(endpoint, function(req, res) {
        Room.addRoom(req.body.name, function(r) {
            res.json(r)
        })
    })
}