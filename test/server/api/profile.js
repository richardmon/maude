var expect = require('chai').expect;
var request = require('supertest');

var LOCAL_ADDRESS = 'http://localhost:3002';

var loggedIn = request.agent(LOCAL_ADDRESS);
// User taken from seeder
var fakeUser = {
  email: 'test@email.com',
  password: '1a2b3c4d5e6'
};
var userId;
var user = {
  picture: 'images/avatar.png',
  name : 'Test User',
  email : 'test@email.com',
  password : '1a2b3c4d5e6'
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

describe('Profile Api', function(){
  describe('GET Profile', function(){
    it('should return full profile if requesting own profile', function(done){
      loggedIn
        .get('/profile/' + userId)
        .expect(200)
        .end(function(err, res){
          expect(res.body).to.exist;
          expect(res.body._id).to.be.equal(userId);
          expect(res.body.name).to.be.equal(user.name);
          expect(res.body.picture).to.be.equal(user.picture);
          expect(res.body.sex).to.be.equal('OTHER');
          expect(res.body.birth).to.exist;
          expect(new Date(res.body.birth).toDateString()).not.to.contain('Invalid');
          expect(res.body.password).not.to.exist;
          expect(res.body.salt).not.to.exist;
          done();
        });
    });
  });
});
