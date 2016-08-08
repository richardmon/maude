var expect = require('chai').expect;
var request = require('supertest');

var loggedIn = request.agent('http://localhost:3002');
var noLoggedIn = request.agent('http://localhost:3002');

var userId;
var commentId;
var fakeUser = {
  email: 'test@email.com',
  password: '1a2b3c4d5e6'
};

describe('Comments', function(){
  var comment = {
    creator: userId,
    content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    title: 'Title',
    replies: []
  };

  before(function(done){
    loggedIn
      .post('/auth/session')
      .send(fakeUser)
      .expect(200)
      .end(function(err, res){
        userId = res.body._id;
        comment.creator = userId;
        done();
      });
  });


  after('Clean db', function(){
    process.env.NODE_ENV = 'test';
    var mongoose = require('mongoose');
    var config = require('../../../server/config');
    require('../../../server/models/comment');

    var db = mongoose.createConnection(config.db);
    db.model('Comment').remove({}).exec();
  });

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
        end(function(err, res){
          expect(res.statusCode).to.be.equal(401);
          expect(res.body).to.be.empty;
          done();
        });
    });
  });

  describe('GET get comments', function(){
    before(function(done){
      loggedIn.
        post('/comment').
        send(comment).
        end(function(err, res){
          commentId = res.body._id;
          done();
        });
    });

    it('should get comment based on ids', function(done){
      noLoggedIn.
        get('/comment/' + commentId).
        expect(200).
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

    it('should get 404 if does not exist', function(done){
      noLoggedIn.
        get('/comment/' + 'notAValidId').
        end(function(err, res){
          expect(res.statusCode).to.be.equal(404);
          expect(res.body).to.be.empty;
          done();
        });
    });
  });

  describe('PUT update comments', function(){
    beforeEach(function(done){
      loggedIn.
        post('/comment').
        send(comment).
        end(function(err, res){
          commentId = res.body._id;
          done();
        });
    });

    it('it should update the content in the comment', function(done){
      var newContent = {
        content: 'new content'
      };
      loggedIn.
        put('/comment/' + commentId).
        send(newContent).
        end(function(err, res){
          expect(res.body.content).to.be.equal(newContent.content);
          noLoggedIn.
            get('/comment/' + commentId).
            end(function(err, res){
              expect(res.body.content).to.be.equal(newContent.content);
              done();
            });
        });
    });

    it('it should not update the content in the comment if is not the creator', function(done){
      var secondUser = request.agent('http://localhost:3002');
      var fakeUser2 = { // User taken from seeder
        email: 'test2@email.com',
        password: '1a2b3c4d5e6'
      };

      var newContent = {
        content: 'new content'
      };

      secondUser
        .post('/auth/session')
        .send(fakeUser2)
        .end(function(err, res){ // Logged In
          secondUser.
          put('/comment/' + commentId).
          send(newContent).
          end(function(err, res){
            expect(res.body.content).not.to.be.equal(newContent.content);
            expect(res.body.content).to.be.equal(comment.content); // Has not change
            done();
          });
        });
    });
  });

  describe('DELETE delete comments', function(){
    var secondUser;

    before(function(done){
      secondUser = request.agent('http://localhost:3002');
      var fakeUser2 = { // User taken from seeder
        email: 'test2@email.com',
        password: '1a2b3c4d5e6'
      };
      secondUser
        .post('/auth/session')
        .send(fakeUser2)
        .expect(200)
        .end(done);
    });

    beforeEach(function(done){
      loggedIn.
        post('/comment').
        send(comment).
        end(function(err, res){
          commentId = res.body._id;
          done();
        });
    });

    it('should delete a comment if the creator wants it', function(done){
      loggedIn.
        del('/comment/'+ commentId).
        expect(200).
        end(function(err, res){
          expect(err).to.be.null;
          done();
        });
    });

    it('should not be able to delete a comment if is not the creator', function(done){

      secondUser.
      del('/comment/' + commentId).
      end(function(err, res){
        expect(res.statusCode).to.be.equal(403);
        noLoggedIn. // check if the comment is still there
          get('/comment/' + commentId).
          expect(200).
          end(function(err, res){
            expect(err).to.be.null;
            expect(res.body).to.exist;
            done();
          });
      });
    });

    it('should return a 401 code if the comment id is not valid', function(done){
      noLoggedIn.
        del('/comment/' + 'notAValidId').
        expect(401).
        end(done);
    });
  });
});
