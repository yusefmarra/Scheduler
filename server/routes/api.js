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
        res.json({message: "Authentication Failed. Some kinda error.", code: 400, err: err});
      }
      if (!user) {
        res.statusCode = 404;
        res.json({message: "Authentication Failed. User not found", code:404});
      } else {

        user.comparePassword(req.body.password, function(err, match) {
          if (!err) {
            if (match) {
              var token = jwt.sign(user, process.env.secret, {
                expiresInMinutes: 1440,
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

router.post('/restaurant/add', function(req, res){
  if (req.body.name){
    new Restaurant(req.body).save(function(err, restaurant){
      if (!err){
        res.json({
          message: "successfully added: " + restaurant.name ,
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


module.exports = router;
