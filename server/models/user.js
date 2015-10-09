var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
require('dotenv').load();

SALT_WORK_FACTOR = 10;


var User = new Schema (
  {
    name: { type:String, required:true },
    password: { type:String, required:true },
    email: { type: String, required:true, index:{ unique:true } },
    admin: { type: Boolean },
    phone: { type: Number },
    roles: [String],
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant'
    },
    schedules: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Schedule'
    }]
  }
);



User.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (!err) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (!err) {
          user.password = hash;
          next();
        } else { return next(err); }
      });
    } else { return next(err); }
  });
});

User.methods.comparePassword = function(inputPassword, cb) {
  bcrypt.compare(inputPassword, this.password, function(err, match) {
    if (err) { return cb(err); }
    else {
      cb(null, match);
    }
  });
};


module.exports = mongoose.model('users', User);
