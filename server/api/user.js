const User = require('../models/user');
const Message = require('../models/message');

module.exports = function(app){
    let endpoint = "/api/user";

    app.post(endpoint + "/login", function(req, res) {
        User.login(req.body, (r) => {
            res.json(r)
        });
    });

    app.get(endpoint, function(req, res) {
        User.getUsers((r) => {
            res.json(r);
        })
    })

    app.get(endpoint + "/del/:id", function(req, res) {
        User.findById(req.params.id, (err, theUser) => {
            User.deleteUser(req.params.id, (r) => {
                Message.deleteUser(theUser.name, (r) => {
                    res.json(r);
                })
            });
        })
    })
}