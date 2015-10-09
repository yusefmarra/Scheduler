process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server/app');

var User = require('../server/models/user.js');
var Restaurant = require('../server/models/restaurant.js');

Restaurant.collection.drop();
User.collection.drop();

var should = chai.should();

chai.use(chaiHttp);

var token;
var adminToken;

describe('User', function() {

  beforeEach(function(done){
    var restaurant = new Restaurant({
      name: 'Testaurant'
    });
    restaurant.save(function(err) {
      console.log('Made restaurant');
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
      }
    });

    done();

    // employee
    //   .populate('restaurants')
    //   .exec(function(error, users) {
    //     console.log('Gibber Jabber');
    //   });

    // chai.request(server)
    //   .post('/api/user/authenticate')
    //   .send({
    //     'email':'test@test.com',
    //     'password':'test123'
    //   })
    //   .end(function(err, res) {
    //     adminToken = res.body.token;
    //     done();
    //   });

  });

  afterEach(function(done){
    Restaurant.collection.drop();
    User.collection.drop();
    done();
  });



  it('"/api/user/authenticate" should take name and password and return a token', function(done) {
    chai.request(server)
      .post('/api/user/authenticate')
      .send({
        'email':'test@test.com',
        'password':'test123'
      })
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
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
        res.should.be.json;
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
        res.should.be.json;
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
//         res.should.be.json;
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
