/**
 * Created by trainee on 6/8/16.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Role = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    weight: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    description: {
        type: String,
        required: true
    },
    permissions: [Number]
});

module.exports = mongoose.model('Role', Role);