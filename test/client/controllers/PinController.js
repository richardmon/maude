describe('Pin Controller', function(){

  var q;
  var deferred;
  var pinCtrl;
  var mockPinService;
  var scope;
  var state;
  var pinModel;
  var pinId;
  var user;

  beforeEach(module('maude'));

  beforeEach(inject(function($httpBackend, $templateCache){
    $httpBackend.whenGET('/auth/session').respond(200);
    $templateCache.put('views/pin.html','<div>blank or whatever</div>');
  }));

  beforeEach(function(){
    mockPinService = {
      createPin: function(){
        deferred = q.defer();
        return deferred.promise;
      }
    };
  });

  beforeEach(inject(function($q, $controller, $rootScope, $state, $stateParams, $httpBackend){
    // mock pin
    pinModel = {
      title: 'TItle',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt inculpa qui officia deserunt mollit anim id est laborum.',
      location: {
        Lat: '123',
        Lng: '124'
      },
    };
    //mock user
    user = {
      email : undefined,
      name: 'Test Name',
      _id : 9876
    };

    q = $q;
    scope = $rootScope.$new();
    scope.user = user;
    state = $state;
    stateParams = $stateParams;
    pinId = 54321;
    pinCtrl = $controller('PinController', {
      $scope: scope,
      pin: mockPinService,
      $state: state,
      $stateParams: stateParams
    });
  }));

  describe('Pin Creation', function(){

    it('should create a pin and redirect to it if success', function(){
      sinon.spy(mockPinService, 'createPin');

      pinCtrl.create(pinModel);
      deferred.resolve(pinId);

      scope.$digest();

      expect(state.current.name).to.equal('pin');
      expect(pinCtrl.errorCreatingPin).to.be.false;
      expect(stateParams.pinId).to.equal(pinId.toString());
      expect(mockPinService.createPin.calledWith(pinModel)).to.be.true;

    });

    it('should  a set errorCreatingPin to true if an error occurse on the creation of a pin', function(){
      sinon.spy(mockPinService, 'createPin');

      pinCtrl.create(pinModel);
      deferred.reject(pinId);

      scope.$digest();

      expect(pinCtrl.errorCreatingPin).to.be.true;
      expect(mockPinService.createPin.calledWith(pinModel)).to.be.true;

    });
  });

});
