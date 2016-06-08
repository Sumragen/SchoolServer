/**
 * Created by trainee on 6/8/16.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Role = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    permissions: [Number]
});

module.exports = mongoose.model('Role', Role);