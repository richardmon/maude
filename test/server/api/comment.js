var expect = require('chai').expect;
var request = require('supertest');
var path = require('path');

var loggedIn = request.agent('http://localhost:3002');
var noLoggedIn = request.agent('http://localhost:3002');

var userId;
var pinId;
var fakeUser = {
  email: 'test@email.com',
  password: '1a2b3c4d5e6'
};

describe('Comments', function(){
  var pin = {
    title : 'Test Title',
    content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    location: [{
      name: 'Location name',
      Lat: '123',
      Lng: '124'
    }]
  };

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

  before(function(done){
    loggedIn.
      post('/pin').
      field('title', pin.title).
      field('content', pin.content).
      field('location', JSON.stringify(pin.location)).
      attach('images', path.normalize(path.join(__dirname, '../files/images/avatar.png'))).
      end(function(err, res){
        pinId = res.body._id;
        done();
      });
  });

  var comment = {
    creator: userId,
    content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    title: 'Title',
    replies: []
  };

  describe('POST create comments', function(){
    it('should create comment if logged in', function(done){
      loggedIn.
        post('/comment').
        send(comment).
        end(function(err, res){
          expect(res.body._id).to.exist;
          expect(res.body.content).to.be.equal(comment.content);
          expect(res.body.title).to.be.equal(comment.title);
          expect(res.body.replies).to.be.instanceOf(Array);
          expect(res.body.replies).to.be.eql(res.body.replies);
          expect(res.body.creator).to.be.equal(comment.creator);
          done();
        });
    });

    it('should not create comment if user is not logged in', function(done){
      noLoggedIn.
        post('/comment').
        send(comment).
        expect(403).
        end(function(err, res){
          expect(res.body).to.be.empty;
          done();
        });
    });
  });
});
