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
    router = require('./router'),
    config = require('./libs/config'),
    log = require('./libs/log')(module);

var port = config.get('port');
var host = config.get('host');

//configure
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9002');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Access-Control-Allow-Origin,content-type');
    next();
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
