/**
 * Created by trainee on 6/17/16.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('./user'),
    Subject = require('./subject');

/**
 * ------ model ------
 *  id: 1,
 *  user: 1,
 *  subjects: [1, 2]
 */
var Teacher = new Schema({
    user: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: new mongoose.Types.ObjectId
        },
        name: {
            type: String,
            default: 'default teacher name'
        }
    },
    subjects: [{
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        default: new mongoose.Types.ObjectId
    }]
});

module.exports = mongoose.model('Teacher', Teacher);