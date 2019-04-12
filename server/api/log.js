module.exports = function(app){
    let endpoint = "/api/log";

    app.get(endpoint + "/history", function(req, res){
        res.json({'hi': 'hi'});
    });

    app.post(endpoint, function(req, res) {

    });
}