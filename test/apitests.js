process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server/app');

var User = require('../server/models/user.js');
var Restaurant = require('../server/models/restaurant.js');
var Schedule = require('../server/models/schedule.js');

var should = chai.should();

chai.use(chaiHttp);

var token;
var adminToken;

var restaurant = new Restaurant({'name': restName});

restaurant.save(function(err, restaurant) {
  console.log(restaurant);
});

var employee = new User({
  name: 'admin',
  password: 'test123',
  email: 'test@test.com',
  admin: true,
  phone: 9876543210,
  roles: ['Manager'],
  restaurant: restaurant._id
});

employee.save(function(err, user) {
  if (err) {
    console.log(err);
  } else {
    console.log(user);
    User.find({}, function(err, users) {
      console.log(users);
    });
  }
});



describe('User', function() {
  it('"/api/user/authenticate" should take name and password and return a token', function(done) {
    chai.request(server)
      .post('/api/user/authenticate')
      .send({
        'email':'test@test.com',
        'password':'test123'
      })
      .end(function(err, res) {
        res.should.have.status(200);
        res.body.should.have.property('token');
        adminToken = res.body.token;
        done();
      });
  });
  it('"/api/user/add" should take name, password, email, roles, and phone and create a new user', function(done){
    chai.request(server)
      .post('/api/user/add')
      .set('x-access-token', adminToken)
      .send({
        'name':'test',
        'password':'test123',
        'email':'employee@test.com',
        'phone':1234567890,
        'roles':['bartender', 'server']
      })
      .end(function(err, res) {
        res.should.have.status(200);
        res.body.message.should.equal('User successfully created.');
        res.body.user.should.have.property('restaurant');
        res.body.user.restaurant.should.equal(restaurant._id);
        done();
      });
  });
  it('"/api/user/edit" should allow you to set change your own user properties', function(done) {
    chai.request(server)
      .post('/api/user/edit')
      .set('x-access-token', token)
      .send({
        'email': 'new@email.com',
        'phone': 9876543210,
        'name': 'newName'
      })
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });
  it('"/api/user/edit" should not allow you to change the admin status of a user if you are not already an admin', function(done) {
    done();
  });
});

// describe('Restaurant', function() {
//   it('"/api/restaurant/" should return 401 if no valid token is given to it', function(done) {
//     chai.request(server)
//       .get('/api/restaurant/')
//       .end(function(err, res) {
//         res.should.have.status(401);
//         done();
//       });
//   });
//   it('should return Restaurant associated with user info taken from the token', function(done) {
//     chai.request(server)
//       .set('x-access-token', token)
//       .get('/api/restaurant')
//       .end(function(err, res) {
//         res.should.have.status(200);
//         done();
//       });
//   });
// });
