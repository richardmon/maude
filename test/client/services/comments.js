'use strict';

describe('Comment Service', function(){
  var httpBackend;
  var commentService;
  var commentResponse = {
    creator: '12345', // User id
    content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    title: 'Title',
    replies: []
  };

  var URL = '/comment/';

  beforeEach(module('maude'));

  /**
   * Avoid the request to the server from the app and ui-router
   **/
  beforeEach(inject(function($httpBackend, $templateCache){
    $httpBackend.whenGET('/auth/session').respond(200);
    $templateCache.put('views/pin.html','<div>blank or whatever</div>');
  }));

  /**
   * Init the service
   **/
  beforeEach(inject(function(_$httpBackend_, _comment_){
    httpBackend = _$httpBackend_;
    commentService = _comment_;
  }));;

  describe('Get Comment', function(){
    it('should get the pin with the id', function(){
      var commentId = '12346';
      httpBackend.whenGET(URL + commentId).respond(commentResponse);
      commentService.getComment(commentId).then(function(comment){
        expect(comment.creator).to.be.eql(commentResponse.creator);
        expect(comment.content).to.be.eql(commentResponse.content);
        expect(comment.title).to.be.eql(comment.title);
        expect(comment.replies).to.be.eql(comment.replies);
      });
      httpBackend.flush();
    });

    it('should not get the pin if the id is incorrect', function(){
      var invalidCommentId = 'invalidId';
      httpBackend.whenGET(URL + invalidCommentId).respond(404);
      commentService.getComment(invalidCommentId).then(function(comment){
        expect(comment).to.be.null;
      });
      httpBackend.flush();
    });
  });

  describe('Delete Comment', function(){
    it('should delete a comment with it\'s id', function(){
      var commentId = '12346';
      httpBackend.whenDELETE(URL + commentId).respond(200);

      commentService.deleteComment(commentId)
        .then(function(solve){
          expect(solve.$resolved).to.be.true;
        });
      httpBackend.flush();
    });
  });
});

