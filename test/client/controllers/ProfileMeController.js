describe('Profile Me Controller', function(){

  var q;
  var deferred;
  var profileMeCtrl;
  var mockProfileService;
  var mockProfileMe;
  var rootScope;
  var user;

  beforeEach(module('maude'));

  /**
   * Avoid the request to the server from the app and ui-router
   **/
  beforeEach(inject(function($httpBackend, $templateCache){
    $httpBackend.whenGET('/auth/session').respond(200);
    $templateCache.put('views/profile/profileMe.html','<div>blank or whatever</div>');
  }));

  /**
   * mocks the pin service
   **/
  beforeEach(function(){
    mockProfileService = {
      get: function(){
        deferred = q.defer();
        return deferred.promise;
      }
    };
  });

  beforeEach(inject(function($q, $controller, $rootScope){
    //mock user
    user = {
      email : undefined,
      name: 'Test Name',
      _id : 9876
    };

    // mock profile
    mockProfileMe = {
      '_id': 9876,
      'picture': 'images/avatar.png',
      'name': 'Test Name',
      'email': 'email@test.com',
      'sex': 'OTHER',
      'birth': Date.now()
    };

    q = $q;
    rootScope = $rootScope.$new();
    rootScope.user = user;
    profileMeCtrl = $controller('ProfileMeController', {
      $rootScope: rootScope,
      profile: mockProfileService,
    });
  }));


  describe('Get Profile', function(){
    it('should get profile if user  is logged in', function(){
      rootScope.$digest();

      deferred.resolve(mockProfileMe);

      rootScope.$digest();

      expect(profileMeCtrl.profile).to.be.eql(mockProfileMe);
    });

  });




});
