var mongoose = require('mongoose');

var User = require('./user.js');
var Restaurant = require('./restaurant.js');
var Schedule = require('./schedule.js');

mongoose.connect('mongodb://localhost/scheduler-test');

var restName = 'Testaurant';
var userName = 'admin';
var password = 'test123';
var email = 'test@test.com';



new Restaurant({'name': restName}).save(function(err, restaurant) {
  console.log('what');
  if (!err) {
    console.log(restaurant);
    new User({
      'name': userName,
      'email': email,
      'password': password,
      'admin': true,
      'restaurant': restaurant._id,
      'roles': ['Manager']
    }).save(function(err, user) {
      User.findById(user._id)
        .populate('restaurants')
        .exec(function(error, users) {
          console.log(JSON.stringify(users, null, "\t"));
        });
    });
  } else {
    console.log('you are a butthole');
  }
});

// process.exit();
