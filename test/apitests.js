process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server/app');

var User = require('../server/models/user.js');
var Restaurant = require('../server/models/restaurant.js');


var should = chai.should();

chai.use(chaiHttp);

var token;

describe('User', function() {
  it('"/api/user/add" should take name, password, email, and phone and create a new user', function(done){
    chai.request(server)
      .post('/api/user/add')
      .send({
        'name':'test',
        'password':'test123',
        'email':'test@test.com',
        'phone':123456789
      })
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.message.should.equal('User successfully created.');
        done();
      });
  });
  it('"/api/user/authenticate" should take name and password and return a token', function(done) {
    chai.request(server)
      .post('/api/user/authenticate')
      .send({
        'name':'test',
        'password':'test123'
      })
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('token');
        token = res.body.token;
        done();
      });
  });
  it('"/api/user/edit" should allow you to set change your own user properties', function(done) {
    chai.request(server)
      .post('/api/user/edit')
      .send({
        'email': 'new@email.com',
        'phone': 9876543210
      })
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
      });
  });
  it('"/api/user/edit" should not allow you to change the admin status of a user if you are not already an admin', function(done) {

  });
});

describe('Restaurant', function() {
  it('"/api/restaurant/add" should return 401 if no valid token is given to it', function(done) {
    chai.request(server)
      .post('/api/restaurant/add')
      .send({
        'name': 'Test Rest'
      })
      .end(function(err, res) {
        res.should.have.status(401);
        res.should.be.json;
        done();
      });
  });
  it('"/api/restaurant/add" should take a restaurant name and create a new restaurant', function(done) {
    chai.request(server)
      .post('/api/restaurant/add')
      .send({
        'name': 'Test Rest',
        'token': token
      })
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        done();
      });
  });
  it('should associate the user that created the restaurant with said restaurant', function(done) {

  });
  it('should return Restaurant associated with user info taken from the token', function(done) {

  });
});


User.collection.drop();
Restaurant.collection.drop();
