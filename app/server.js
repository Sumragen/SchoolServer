/**
 * Created by trainee on 6/3/16.
 */
'use strict';
var path = require('path'),
    http = require('http'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

var port = 3000; //must be in configs
var host = 'localhost';

//configure
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9002');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Access-Control-Allow-Origin,content-type');
    next();
});

app.get('/api', function (req, res) {
    res.send('hello api');
});
app.post('/api/login', function (req, res) {
    console.log('/api/login');
    var user = req.body;
    res.send({user: user, sessionToken: 'some token'})
});
app.get('/', function (req, res) {
    res.send('hello');
});

function onRequest() {
    console.log('request');
}
http.createServer(app).listen(port, host, function () {
    console.log('Listening ' + host + ':' + port);
});
