describe('Pin Controller', function(){

  var q;
  var deferred;
  var pinCtrl;
  var mockPinService;
  var scope;
  var state;
  var stateParams;
  var pinModel;
  var pinResponse;
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
      },
      getPin: function(){
        deferred = q.defer();
        return deferred.promise;
      }
    };
  });

  beforeEach(inject(function($q, $controller, $rootScope, $state, $stateParams){
    // mock pin
    pinModel = {
      title: 'TItle',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt inculpa qui officia deserunt mollit anim id est laborum.',
      location: [{
        name: 'Location name',
        Lat: '123',
        Lng: '124'
      }],
    };
    //mock user
    user = {
      email : undefined,
      name: 'Test Name',
      _id : 9876
    };

    // Mocks server answer
    pinResponse = {
      _id: 122423346,
      title: 'TItle',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt inculpa qui officia deserunt mollit anim id est laborum.',
      location: [{
        name: 'Location name',
        Lat: '123',
        Lng: '124'
      }],
    };
    q = $q;
    scope = $rootScope.$new();
    scope.user = user;
    state = $state;
    stateParams = $stateParams;
    pinCtrl = $controller('PinController', {
      $scope: scope,
      pin: mockPinService,
      $state: state,
      $stateParams: stateParams
    });
  }));

  describe('Pin Controller', function(){

    describe('Create Pin', function(){
      it('should create a pin and redirect to it if success', function(){
        sinon.spy(mockPinService, 'createPin');
        var valid = true;

        pinCtrl.create(valid, pinModel);
        deferred.resolve(pinResponse);

        scope.$digest();

        expect(state.current.name).to.equal('pin');
        expect(pinCtrl.errorCreatingPin).to.be.false;
        expect(stateParams.pinId).to.equal(pinResponse._id.toString());
        expect(mockPinService.createPin.calledWith(pinModel)).to.be.true;

      });

      it('should  a set errorCreatingPin to true if an error occurse on the creation of a pin', function(){
        sinon.spy(mockPinService, 'createPin');
        var valid = true;

        pinCtrl.create(valid, pinModel);
        deferred.reject(pinResponse);

        scope.$digest();

        expect(pinCtrl.errorCreatingPin).to.be.true;
        expect(mockPinService.createPin.calledWith(pinModel)).to.be.true;

      });
    });

    describe('Pin Definition', function(){
      var location;
      beforeEach(function(){
        // Mock expected entry
        location = {
          name: 'Location name',
          Lat: 57.000,
          Lng: -47.000
        };
        // Mock google maps API
        pinCtrl.place = {
          name: location.name,
          geometry: {
            location: {
              lat: function(){},
              lng: function(){}
            }
          }
        };
      });

      it('should add a new location if the entry is valid', function(){
        sinon.stub(pinCtrl.place.geometry.location,'lat').returns(location.Lat);
        sinon.stub(pinCtrl.place.geometry.location,'lng').returns(location.Lng);

        expect(pinCtrl.pinModel.location).to.be.instanceOf(Array);
        expect(pinCtrl.pinModel.location).to.be.empty;
        expect(pinCtrl.locationInput).to.exist;

        pinCtrl.addLocationPinCreation();

        expect(pinCtrl.locationInput).to.be.empty;
        expect(pinCtrl.place).not.to.exist;
        expect(pinCtrl.pinModel.location).to.contain(location);
      });
    });
  });

  describe('Pin Description', function(){
    beforeEach(inject(function($controller){
      state.current.name = 'pin';
      stateParams.pinId = 123442;
      sinon.spy(mockPinService, 'getPin');
      pinCtrl = $controller('PinController', {
        $scope: scope,
        pin: mockPinService,
        $state: state,
        $stateParams: stateParams
      });
    }));

    it('should get the pin information', function(){

      expect(pinCtrl.pin).to.be.empty;

      deferred.resolve(pinResponse);
      scope.$digest();

      expect(pinCtrl.pin).to.be.equal(pinResponse);
      expect(mockPinService.getPin.called).to.be.true;
    });
  });

});
