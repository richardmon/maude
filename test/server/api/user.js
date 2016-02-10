var expect = require('chai').expect;
var request = require('supertest');

var LOCAL_ADDRESS = 'http://localhost:3002';

var user;
var userId;


before(function(){
  // User taken from seeder file
  user = {
    picture: 'images/avatar.png',
    name : 'Test User',
    email : 'test@email.com',
    password : '1a2b3c4d5e6'
  };

  request(LOCAL_ADDRESS)
    .post('/auth/session')
    .send(user)
    .expect(200)
    .end(function(err, res){
      userId = res.body._id;
    });
});

describe('User Api', function(){
  describe('GET user details', function(){

    it('shoult return user information', function(done){
      request(LOCAL_ADDRESS)
        .get('/user/' + userId)
        .expect(200)
        .end(function(err, res){

          expect(res.body).to.exist;
          expect(res.body._id).to.be.equal(userId);
          expect(res.body.name).to.be.equal(user.name);
          expect(res.body.picture).to.be.equal(user.picture);
          expect(res.body.password).not.to.exist;
          expect(res.body.salt).not.to.exist;
          done();

        });
    });

    it('shoud return error 404 in case of not found', function(done){
      var invalidId = 1234455;
      request(LOCAL_ADDRESS)
        .get('/user/' + invalidId)
        .expect(404)
        .end(function(err, res){
          expect(res.body).to.be.empty;
          done();
        });
    });
  });
});
