/**
 * Created by trainee on 6/7/16.
 */
var mongoose = require('mongoose'),
    log = require('./log')(module),
    config = require('./config');


mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:' + err.message);
});
db.once('open', function callback() {
    log.info('Connected to DB');
});

var Schema = mongoose.Schema;

var Role = Schema({
    id: {type: Number, required: true, unique: true},
    name: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    permissions: [Number]
});
var User = Schema({
    id: {type: Number, required: true, unique: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    roles: [Role]
});

User.path('password').validate(function (v) {
    return v.length > 4
});

var UserModel = mongoose.model('User', User);

module.exports.UserModel = UserModel;