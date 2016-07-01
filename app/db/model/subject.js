/**
 * Created by trainee on 6/9/16.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('./user');

/**
 * ------ model ------
 *  id: 1,
 *  name: 'History',
 *  teachers: [1, 5, 6],
 *  classRooms: [202]
 */
var Subject = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    teachers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: new mongoose.Types.ObjectId
    }],
    classRoom: [Number]
});

module.exports = mongoose.model('Subject', Subject);