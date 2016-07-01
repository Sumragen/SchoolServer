/**
 * Created by trainee on 6/3/16.
 */
'use strict';
var http = require('http'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    headerSession = require('node-header-session'),
    morgan = require('morgan'),
    passport = require('passport'),
    router = require('./router'),
    config = require('./config'),
    oauth2 = require('./auth/oauth2'),
    accessControl = require('./auth/accessControl'),
    log = require('./log')(module);

var port = config.get('port');
var host = config.get('host');

app.use(bodyParser.json());
app.use(cookieParser('foo'));
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(function (req, res, next) {
    res.set(config.get('default:headers'));
    next();
});
headerSession(app, config.get('default:headerSession'));

//handle authorized user
accessControl.checkPath(app);

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
