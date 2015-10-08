var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Schedule = new Schema (
  {
    date: {type: Date, required:true},
    timeStart: {type: String, required:true},
    timeDone: {type: String, required:true}
  }
);

module.exports = mongoose.model('schedules', Schedule);
