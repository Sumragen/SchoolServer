/**
 * Created by trainee on 6/9/16.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('./user'),
    config = require('./../config');


/**
 * ----- Model -----
 *  id: 13,
 *  stage: 10,
 *  suffix: 'A',
 *  formMaster: {
 *      id: 2,
 *      name: 'Lisa Kuddrow'
 *  }
 */
var Stage = new Schema({
    stage: {
        type: Number,
        required : true,
        min: config.get('default:stage:min'),
        max: config.get('default:stage:max')
    },
    suffix: {
        type: String,
        required: true
    },
    formMaster: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: new mongoose.Types.ObjectId
    }
});
Stage.path('suffix').validate(function (v) {
    return v.length == 1;
});

module.exports = mongoose.model('Stage', Stage);