var jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('users');
var Restaurant = mongoose.model('restaurants');
require('dotenv').load();



router.post('/user/add', function(req, res) {
  if (req.body.name && req.body.password && req.body.email && req.body.phone) {
    new User(req.body).save(function(err, user) {
      if (!err) {
        res.statusCode = 200;
        res.json({
          message: "User successfully created.",
          code: 200,
        });
      } else {
        if (err.code === 11000) {
          res.statusCode = 400;
          res.json({
            message: "That username already exists",
            code: 400
          });
        } else {
          throw err;
        }
      }
    });
  } else {
    res.statusCode = 400;
    res.json({
      message: "Must provide all fields",
      code: 400
    });
  }
});

router.post('/user/authenticate', function(req, res) {
  if (req.body.name && req.body.password) {
    User.findOne({name: req.body.name}, function(err, user) {
      if (err) {
        res.statusCode = 400;
        res.json({message: "Authentication Failed. Some kinda error.",
          code: 400,
          err: err});
      }
      if (!user) {
        res.statusCode = 404;
        res.json({message: "Authentication Failed. User not found",
          code:404});
      } else {
        user.comparePassword(req.body.password, function(err, match) {
          if (!err) {
            if (match) {
              var token = jwt.sign(user, process.env.secret, {
                expiresIn: 1440*60,
              });
              res.statusCode = 200;
              res.json({
                message: "Authentication succeeded.",
                token: token,
                code: 200
              });
            } else {
              res.statusCode = 403;
              res.json({
                message: "Authentication failed. Wrong password.",
                code: 403
              });
            }
          } else { throw err; }
        });
      }
    });
  } else {
    res.statusCode = 400;
    res.json({message: "You must provide all fields", code: 400});
  }
});


// **** EVERYTHING AFTER THIS POINT REQUIRES A TOKEN *** //

router.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, process.env.secret, function(err, decoded) {
      if (!err) {
        req.decoded = decoded;
        next();
      } else {
        res.statusCode = 403;
        res.json({
          message: "No token provided",
          code: 403
        });
      }
    });
  } else {
    res.statusCode = 403;
    res.json({
      message: "No token provided.",
      code: 403
    });
  }
});

//Restaurant endpoints

router.post('/restaurant/add', function(req, res){
  if (req.body.name){
    new Restaurant(req.body).save(function(err, restaurant){
      if (!err){
        User.findOneAndUpdate({id: req.decoded.id}, {restaurantId: restaurant.id}, function(err, user) {
          if (!err) {
            console.log("hey good job buddy.");
          }
        });
        res.json({
          message: "successfully added: " + restaurant.name,
          user: req.decoded.name,
          code: 200
        });
      } else {
        res.statusCode = 403;
        res.json({
          message: "Error saving",
          code: 403,
          error: err
        });
      }
    });
  } else {
    res.statusCode = 403;
    res.json({
      message: "No name provided.",
      code: 403
    });
  }
});


router.get('/restaurants', function(req, res){
  if (!req.decoded.restaurantId) {
// fill later
  } else {
    Restaurant.find({'_id': req.decoded.restaurantId}, function(err, restaurant) {
      if (!err) {
      res.json({
        restaurant: restaurant,
        message: "Restaurant found.",
        code: 200
      });
     } else {
      res.json({
        message: "No restaurant found.",
        code: 404
      });
     }
    });
  }
});

//User endpoints

router.get('/users', function(req, res){
  if (!req.decoded.restaurantId) {
//fill later
  } else {
    User.find({restaurantId: req.decoded.restaurantId}, function(err, users){
      if (!err) {
        res.json({
          users: users,
          message: "All users found.",
          code: 200
        });
      } else {
        res.json({
          message: "No users found.",
          code: 404
        });
      }
    });
  }
});


router.put('user/edit', function(req, res){
  User.findOneAndUpdate({'_id': req.decoded.id}, {password: req.body.password, email: req.body.email, phone: req.body.phone}, function(err, user){
    if (!err) {
      res.json({
        message: "Succesfully updated user information!",
        code: 200
      });
    } else {
      res.json({
        message: "Oops, there was a problem updating your user information",
        code: 418
      });
    }
  });
});





module.exports = router;
