/**
 * Created by trainee on 6/3/16.
 */
'use strict';
var path = require('path'),
    http = require('http'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    passport = require('passport'),
    libs = process.cwd() + '/app/libs/',
    router = require('./router'),
    config = require(libs + 'config'),
    oauth2 = require(libs + 'auth/oauth2'),
    log = require(libs + 'log')(module);

var port = config.get('port');
var host = config.get('host');

//configure
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(passport.initialize());
require(libs + 'auth/auth');
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9002');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Access-Control-Allow-Origin,content-type');
    next();
});


app.post('/oauth/token', oauth2.token);
app.get('/api/userInfo',passport.authenticate('bearer', {session: false}),
    function (req, res) {
        res.json({ user_id: req.user.userId, name: req.user.username, scope: req.authInfo.scope })
    });

//catch errors
/*
app.use(function (req, res, next) {
    res.status(404);
    log.debug('Not found URL: %s', req.url);
    res.send({error: 'Not found'});
});
*/

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    log.error('Internal error(%d): %s', res.statusCode, err.message);
    res.send({error: err.message});
});

router.initRoutes(app);

http.createServer(app).listen(port, host, function () {
    log.info('Express server listening %s:%s', host, port);
});
