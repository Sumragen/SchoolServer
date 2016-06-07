/**
 * Created by trainee on 6/6/16.
 */
var db = require('./data/source'),
    auth = require('./endpoint/auth');


function initRoutes(app){
    app.post('/api/login', function (req, res) {
        db.login(req, res);
    });
    app.post('/api/register', function (req, res) {
        db.register(req, res);
    })
}

exports.initRoutes = initRoutes;