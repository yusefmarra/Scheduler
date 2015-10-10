var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Schedule = new Schema (
  {
    date: {type: Date, required:true},
    timeStart: {type: String, required:true},
    timeFinish: {type: String, required:true},
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
);

module.exports = mongoose.model('schedules', Schedule);
