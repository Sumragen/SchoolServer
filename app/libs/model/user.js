/**
 * Created by trainee on 6/7/16.
 */
var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Role = require('./role'),
    Schema = mongoose.Schema;

var User = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    roles: [{type: Schema.Types.ObjectId, ref: 'Role'}]
});
User.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};
User.virtual('userId')
    .get(function () {
        return this.id;
    });
User.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(32).toString('base64');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
    });
User.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};
User.methods.getToClient = function () {
    return {
        id: this.id,
        first_name: this.first_name,
        last_name: this.last_name,
        username: this.username,
        email: this.email,
        roles: [
            {
                id: this.roles[0].id,
                description: this.roles[0].description,
                name: this.roles[0].name,
                permissions: this.roles[0].permissions
            }
        ]
    }
};

module.exports = mongoose.model('User', User);