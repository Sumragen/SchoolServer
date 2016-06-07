/**
 * Created by trainee on 6/7/16.
 */
var mongoose = require('mongoose'),
    libs = process.cwd() + '/app/libs/',
    log = require(libs + 'log')(module),
    config = require(libs + 'config');

mongoose.connect(config.get('mongoose:uri'));

var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:' + err.message);
});
db.once('open', function callback() {
    log.info('Connected to DB');
});

module.exports = mongoose;