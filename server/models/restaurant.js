var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Restaurant = new Schema (
  {
    name: {type: String, required:true}
  }
);

module.exports = mongoose.model('restaurants', Restaurant);
