/**
 * Created by trainee on 6/3/16.
 */
'use strict';
var path = require('path'),
    http = require('http'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    router = require('./router'),
    config = require('./config');

var port = config.port;
var host = config.host;

//configure
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9002');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Access-Control-Allow-Origin,content-type');
    next();
});

router.initRoutes(app);

http.createServer(app).listen(port, host, function () {
    console.log('Listening ' + host + ':' + port);
});
