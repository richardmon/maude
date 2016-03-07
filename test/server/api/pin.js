var expect = require('chai').expect;
var request = require('supertest');
var path = require('path');

var loggedIn = request.agent('http://localhost:3002');
var noLoggedIn = request.agent('http://localhost:3002');

// User taken from seeder
var fakeUser = {
  email: 'test@email.com',
  password: '1a2b3c4d5e6'
};

var pinId;

describe('Pins', function(){
  var pin = {
    title : 'Test Title',
    content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    location: [{
      name: 'Location name',
      Lat: '123',
      Lng: '124'
    }]
  };
  var userId;

  before(function(done){
    loggedIn
      .post('/auth/session')
      .send(fakeUser)
      .expect(200)
      .end(function(err, res){
        userId = res.body._id;
        done();
      });
  });

  afterEach('Clean db', function(){
    process.env.NODE_ENV = 'test';
    var mongoose = require('mongoose');
    var config = require('../../../server/config');
    require('../../../server/models/pin');

    var db = mongoose.createConnection(config.db);
    db.model('Pin').remove({_id : pinId}).exec();
  });

  describe('POST pin creation', function(){

    it('should create a pin', function(done){
      loggedIn.
        post('/pin')
        .field('title', pin.title)
        .field('content', pin.content)
        .field('location', JSON.stringify(pin.location))
        .attach('images', path.normalize(path.join(__dirname, '../files/images/avatar.png')))
        .end(function(err, res){
          expect(res.statusCode).to.be.equal(200);
          expect(res.body._id).to.be.ok;
          expect(res.body.title).to.be.equal(pin.title);
          expect(res.body.content).to.be.equal(pin.content);
          expect(res.body.location).to.be.instanceOf(Array);
          expect(res.body.location[0]).to.contain(pin.location[0]);
          expect(res.body.creator).to.be.equal(userId);
          expect(res.body.images).not.to.be.empty;
          pinId = res.body._id;
          done();
        });
    });

    describe('should not allowed the creation of a pin', function(){
      it('should not create a pin if user is not logged in', function(done){
        noLoggedIn
          .post('/pin')
          .field('title', pin.title)
          .field('content', pin.content)
          .field('location', JSON.stringify(pin.location))
          .attach('images', path.normalize(path.join(__dirname, '../files/images/avatar.png')))
          .expect(401)
          .end(function(err, res){
            expect(res.body).to.be.empty;
            done();
          });
      });

      it('should not create a pin if location is not provided', function(done){
        loggedIn.
          post('/pin')
          .field('title', pin.title)
          .field('content', pin.content)
          .attach('images', path.normalize(path.join(__dirname, '../files/images/avatar.png')))
          .expect(400)
          .end(function(err, res){
            expect(res.body.errors).to.exist;
            done();
          });
      });

      it('should not create a pin if images are not provided', function(done){
        loggedIn.
          post('/pin')
          .field('title', pin.title)
          .field('content', pin.content)
          .field('location', JSON.stringify(pin.location))
          .expect(400)
          .end(function(err, res){
            expect(res.body.errors).to.exist;
            done();
          });
      });
    });
  });

  describe('GET get pin', function(){

    before(function(done){
      loggedIn
        .post('/pin')
        .field('title', pin.title)
        .field('content', pin.content)
        .field('location', JSON.stringify(pin.location))
        .attach('images', path.normalize(path.join(__dirname, '../files/images/avatar.png')))
        .expect(200)
        .end(function(err, res){
          pinId = res.body._id;
          done();
        });
    });

    it('should return a pin', function(done){
      noLoggedIn
        .get('/pin/' + pinId)
        .expect(200)
        .end(function(err, res){
          expect(res.body).to.exist;
          expect(res.body.available).to.exist;
          expect(res.body.title).to.be.equal(pin.title);
          expect(res.body.content).to.be.equal(pin.content);
          expect(res.body.location).to.be.instanceOf(Array);
          expect(res.body.location[0]).to.contain(pin.location[0]);
          expect(res.body.creator).to.exist;
          expect(res.body.creator).to.be.equal(userId);
          done();
        });
    });

    it('should not return a pin', function(done){
      noLoggedIn
        .get('/pin/NoValidUrl')
        .expect(404)
        .end(function(err, res){
          expect(res.body).to.be.empty;
          done();
        });
    });
  });

  describe('GET search pins', function(){
    before(function(done){
      loggedIn
        .post('/pin')
        .field('title', pin.title)
        .field('content', pin.content)
        .field('location', JSON.stringify(pin.location))
        .attach('images', path.normalize(path.join(__dirname, '../files/images/avatar.png')))
        .expect(200)
        .end(function(err, res){
          expect(res.body).not.to.be.empty;
          pinId = res.body._id;
          done();
        });
    });

    it('should return array of result', function(done){
      var querystring = require('querystring');
      var query = querystring.stringify(pin.location[0]);
      noLoggedIn
        .get('/pins?' + query)
        .expect(200)
        .end(function(err, res){
          expect(res.body).to.be.instanceOf(Array);
          expect(res.body).not.to.be.empty;
          done();
        });
    });
  });
});
