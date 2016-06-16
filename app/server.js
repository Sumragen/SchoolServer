/**
 * Created by trainee on 6/3/16.
 */
'use strict';
var path = require('path'),
    http = require('http'),
    express = require('express'),
    app = express(),
    _ = require('lodash'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    headerSession = require('node-header-session'),
    morgan = require('morgan'),
    passport = require('passport'),
    libs = process.cwd() + '/app/libs/',
    router = require('./router'),
    config = require(libs + 'config'),
    oauth2 = require(libs + 'auth/oauth2'),
    log = require(libs + 'log')(module);

var port = config.get('port');
var host = config.get('host');
var defaultHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'X-Requested-With,Access-Control-Allow-Origin,Content-Type,Accept,X-Sessionid',
    'Access-Control-Allow-Origin': '*'
};
//configure
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(passport.initialize());
//require(libs + 'auth/auth');
app.use(function (req, res, next) {
    res.set(defaultHeaders);
    next();
});

app.use(cookieParser('foo'));
headerSession(app, {
    name: 'x-sessionID',
    debug: false,
    root: '/api'
});

var unsafePath = {'/api/login': ['POST', 'OPTIONS']};
//handle authorized user
app.use(function (req, res, next) {
    console.log('---------------------------------------');
    console.log(req.headerSession.token);
    if(req.method == 'OPTIONS'){
        res.status(200).send({message: 'done'});
    }else{
        req.headerSession.getSession()
            .then(function (session) {
                if (!unsafePath[req.url] || unsafePath[req.url].length > 0 && unsafePath[req.url].indexOf(req.method) > -1) {
                    next();
                } else {
                    if (!session.userId) {
                        res.status(401).send({message: 'Please login'});
                    } else {
                        next();
                    }
                }
            });
    }
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
