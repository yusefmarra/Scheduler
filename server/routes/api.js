var jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('users');
var Restaurant = mongoose.model('restaurants');
require('dotenv').load();


router.post('/user/authenticate', function(req, res) {
  if (req.body.email && req.body.password) {
    User.findOne({email: req.body.email}, function(err, user) {
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
              res.statusCode = 401;
              res.json({
                message: "Authentication failed. Wrong password.",
                code: 401
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


router.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, process.env.secret, function(err, decoded) {
      if (!err) {
        req.decoded = decoded;
        next();
      } else {
        res.statusCode = 401;
        res.json({
          message: "No token provided",
          code: 401
        });
      }
    });
  } else {
    res.statusCode = 401;
    res.json({
      message: "No token provided.",
      code: 401
    });
  }
});

// **** EVERYTHING AFTER THIS POINT REQUIRES A TOKEN *** //

router.post('/user/add', function(req, res) {
  if (req.decoded.admin === true) {
    if (req.body.name && req.body.password && req.body.email && req.body.phone && req.body.roles) {
      var payload = {
        'name': req.body.name,
        'password': req.body.password,
        'email': req.body.email,
        'phone': req.body.phone,
        'restaurant': req.decoded.restaurant
      };
      new User(payload).save(function(err, user) {
        if (!err) {
          User.findById(user._id)
            .populate('restaurant')
            .exec(function(error, newUser) {
              res.statusCode = 200;
              res.json({
                user: newUser,
                message: "User successfully created.",
                code: 200,
              });
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
  } else {
    res.statusCode = 403;
    res.json({
      message: "Must be admin to create new users",
      code:401
    });
  }
});


//Restaurant endpoints


router.get('/restaurants', function(req, res){
  if (!req.decoded.restaurant) {
    // If you hit this you have problems, and you should probably fire your dev team
  } else {
    Restaurant.findById(req.decoded.restaurant, function(err, restaurant) {
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
  if (!req.decoded.restaurant) {
    // If you hit this you have problems, and you should probably fire your dev team
  } else {
    User.find({restaurant: req.decoded.restaurant}, function(err, users){
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
  User.findOneAndUpdate({'_id': req.decoded.id},
    {
      email: req.body.email,
      phone: req.body.phone,
      roles: req.body.roles
    },
    function(err, user){
      if (!err) {
        res.statusCode = 200;
        res.json({
          user: user,
          message: "Succesfully updated user information!",
          code: 200
        });
      } else {
        res.statusCode = 418;
        res.json({
          message: "Oops, there was a problem updating your user information, user was turned into a teapot.",
          code: 418
        });
      }
  });
});

router.put('/user/edit/:id', function(req, res) {
  if (req.decoded.admin === true) {
    User.findById(req.params.id, function(err, user) {
      if (user.restaurant === req.decoded.restaurant) {
        if (req.body.email && req.body.name && req.body.phone && req.body.roles && req.body.admin) {
          user.email = req.body.email;
          user.name = req.body.name;
          user.phone = req.body.phone;
          user.roles = req.body.roles;
          user.admin = req.body.admin;
          user.save(function(err, user) {
            if (!err) {
              res.statusCode = 200;
              res.json({
                user: user,
                message: "User successfully edited",
                code: 200
              });
            }
          });
        } else {
          res.statusCode = 400;
          res.json({
            message: "You must provide all fields",
            code: 400
          });
        }
      } else {
        res.statusCode = 403;
        res.json({
          message: "You must belong to the same restaurant to edit other users",
          code: 403
        });
      }
    });
  } else {
    res.statusCode = 403;
    res.json({
      message: "You must be an admin to edit other users.",
      code: 403
    });
  }
});



module.exports = router;
