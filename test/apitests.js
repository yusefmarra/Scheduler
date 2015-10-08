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
  it('"/api/user/add" should take name, password, email, and phone and create a new user');
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
      });
  it('"/api/user/authenticate" should take name and password and return a token');
});

describe('Restaurant', function() {
  it('should return 401 if no valid token is given to it');
  it('should take a restaurant name and create a new restaurant "restaurant/add"');
  it('should associate the user that created the restaurant with said restaurant');
  it('should return Restaurant associated with user info taken from the token');
});

User.collection.drop();
Restaurant.collection.drop();
