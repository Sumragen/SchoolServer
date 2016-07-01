/**
 * Created by trainee on 6/9/16.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * ----- Model -----
 *  id: 1,
 *  name: 'Rest',
 *  date: 'February 19, 2016 11:50 AM',
 *  description: 'first event (test version)',
 *  address:{
 *      city: 'Kherson',
 *      country: 'Ukraine'
 *  },
 *  location: {
 *      latitude: 46.6699334,
 *      longitude: 32.6169105
 *  }
 */

var Event = new Schema({
    name:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        city : {
            type: String,
            required : true,
            default: 'default city'
        },
        country : {
            type: String,
            required: true,
            default: 'default country'
        }
    },
    location: {
        latitude: Number,
        longitude: Number
    }
});

module.exports = mongoose.model('Event', Event);