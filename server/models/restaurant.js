var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Restaurant = new Schema (
  {
    name: {type: String, required:true}
  }
);

mongoose.model('restaurants', Restaurant);
