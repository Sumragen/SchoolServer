/**
 * Created by trainee on 6/9/16.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    config = require('./../config');

/**
 * ------ Model -----
 *  id: 1,
 *  subject: {
 *      id: 1,
 *      name: 'History'
 *  },
 *  teacher: {
 *      id: 1,
 *      name: defaultUsers[0].first_name + ' ' + defaultUsers[0].last_name
 *  },
 *  stage: '1',
 *  suffix: 'A',
 *  classroom: 220,
 *  day: 'Monday',
 *  order: [1, 3]
 */

var Lesson = new Schema({
    subject: {
        type : Schema.Types.ObjectId,
        ref : 'Subject',
        default: new mongoose.Types.ObjectId
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref : 'Teacher',
        default: new mongoose.Types.ObjectId
    },
    stage : {
        type: Schema.Types.ObjectId,
        ref : 'Stage',
        default : new mongoose.Types.ObjectId
    },
    classroom : {
        type: Number,
        required: true
    },
    day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required : true
    },
    order: {
        type: Number,
        required: true,
        min: config.get('default:lesson:min'),
        max: config.get('default:lesson:max')
    }
});

module.exports = mongoose.model('Lesson', Lesson);