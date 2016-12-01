describe('Comment Controller', function CommentControllerTest(){

  var q;
  var deferred;
  var deferredFirst;
  var deferredSecond;
  var mockCommentService;
  var mockPinService;
  var createResponse;
  var scope;
  var user;
  var pinModel;
  var state;
  var stateParams;

  beforeEach(module('maude'));

  /**
   * avoid the request to the server from the app and ui-router
   **/
  beforeEach(inject(function($httpBackend, $templateCache){
    $httpBackend.whenGET('/auth/session').respond(200);
    $templateCache.put('views/pin.html','<div>blank or whatever</div>');
  }));

  /**
   * mocks the comment service
   **/
  beforeEach(function(){
    mockCommentService = {
      getComment: function(commentid){
        if(commentid === '12abcdd'){//if is a request for the first comment
          return (deferredFirst = q.defer()).promise;
        }
        if(commentid ==='34cdeff'){//if is a request for the second comment
          return (deferredSecond = q.defer()).promise;
        }
      },
    };
  });

  /**
   * mocks the pin service
   **/
  beforeEach(function(){
    mockPinService = {
      createPin: function(){
        deferred = q.defer();
        return deferred.promise;
      },
      getPin: function(){
        deferred = q.defer();
        return deferred.promise;
      }
    };
  });

  beforeEach(inject(function($q, $controller, $rootScope){
    createResponse = [
      {
        creator: '12abcdd', // user id
        content: 'lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        title: 'title 1',
        replies: []
      },
      {
        creator: '34cdeff', // user id
        content: 'lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        title: 'title 2',
        replies: []
      }
    ];

    //mock user
    user = {
      email : undefined,
      name: 'test name',
      _id : 9876
    };

    // mock pin
    pinModel = {
      _id: '1a2b3c', // pin id
      title: 'title',
      content: 'lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. excepteur sint occaecat cupidatat non proident, sunt inculpa qui officia deserunt mollit anim id est laborum.',
      location: [{
        name: 'location name',
        lat: '123',
        lng: '124'
      }],
      images: [
        'image1',
        new Blob(),// image 2
        'image3',
        new Blob() // image 4
      ],
      comments: [
        '12abcdd', // id comment 1
        '34cdeff', // id comment 2
      ]
    };

    q = $q;
    scope = $rootScope.$new();
    scope.user = user;
    commentCtrl = $controller('CommentController', {
      $scope: scope,
      comment: mockCommentService
    });
  }));

  describe('Get Comments', function getComments(){
    it('should get comments from a list with comments id\'s', function(){
      sinon.spy(mockCommentService, 'getComment');

      commentCtrl.getComments(pinModel.comments);
      // gets both of the comments in the given array
      deferredFirst.resolve(createResponse[0]);
      deferredSecond.resolve(createResponse[1]);
      scope.$digest();

      expect(commentCtrl.comments).to.be.eql(createResponse);
      expect(mockCommentService.getComment.called).to.be.true;

    });
  });

  describe('Pin Comments', function(){
    var comment = {
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      replies: []
    };
    beforeEach(inject(function($controller, $state, $stateParams){ // Fills the pin variable
      state = $state;
      stateParams = $stateParams;
      state.current.name = 'pin';
      stateParams.pinId = 123442;
      pinCtrl = $controller('PinController', {
        $scope: scope,
        pin: mockPinService,
        $state: state,
        $stateParams: stateParams
      });

      deferred.resolve(pinModel);
      scope.$digest();
    }));

    xdescribe('Create Comments', function createComments(){
      it('should create a new comment', function() {
        var nroComments = pinCtrl.pin.comments.length;
        commentCtrl.addComment(comment, commentCtrl.pin);

        deferred.resolve();
        scope.$digest();

        expect(pinCtrl.pin.comments.length).toBeGreaterThan(nroComments);
      });
    });
  });
});
