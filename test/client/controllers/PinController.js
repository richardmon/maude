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

  /**
   * Avoid the request to the server from the app and ui-router
   **/
  beforeEach(inject(function($httpBackend, $templateCache){
    $httpBackend.whenGET('/auth/session').respond(200);
    $templateCache.put('views/pin.html','<div>blank or whatever</div>');
  }));

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
      images: [
        'image1',
        new Blob(),// image 2
        'image3',
        new Blob() // image 4
      ]
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
      images: [
        'image1',
        'image2',
        'image3',
        'image4'
      ]
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

    it('should reject a new location if the entry is invalid', function(){
      sinon.stub(pinCtrl.place.geometry.location,'lat').returns(location.Lat);
      sinon.stub(pinCtrl.place.geometry.location,'lng').returns(location.Lng);

      expect(pinCtrl.pinModel.location).to.be.instanceOf(Array);
      expect(pinCtrl.pinModel.location).to.be.empty;

      // Place doesn't exist
      pinCtrl.place = null;

      pinCtrl.addLocationPinCreation();

      expect(pinCtrl.pinModel.location).to.be.empty;
    });

    it('should reject location if already exist', function(){
      sinon.stub(pinCtrl.place.geometry.location,'lat').returns(location.Lat);
      sinon.stub(pinCtrl.place.geometry.location,'lng').returns(location.Lng);

      var place = pinCtrl.place;
      pinCtrl.addLocationPinCreation();

      expect(pinCtrl.pinModel.location.length).to.be.equal(1);

      // Same place
      pinCtrl.place = place;

      pinCtrl.addLocationPinCreation();

      expect(pinCtrl.pinModel.location.length).to.be.equal(1);
    });

    it('should add a new image if loaded', function(){
      expect(pinCtrl.pinModel.images).to.exist;
      expect(pinCtrl.pinModel.images).to.be.empty;

      var file = new Blob(); // creates a file

      pinCtrl.addImagePinCreation(file);

      expect(pinCtrl.pinModel.images.length).to.be.equal(1);
      expect(pinCtrl.imageDuplicated).to.be.false;
      expect(pinCtrl.fullImages).to.be.false;
      expect(pinCtrl.imageInput).to.be.empty;
    });

    it('should not add image if null',  function(){
      expect(pinCtrl.pinModel.images).to.be.empty;

      var file = null;

      pinCtrl.addImagePinCreation(file);
      expect(pinCtrl.pinModel.images.length).to.be.empty;
    });

    it('should not add the same image twice', function(){
      var file = new Blob(); // creates a file
      pinCtrl.addImagePinCreation(file);
      pinCtrl.addImagePinCreation(file);

      expect(pinCtrl.pinModel.images.length).to.be.equal(1);
      expect(pinCtrl.imageDuplicated).to.be.true;
    });

    it('should not add more than four elements', function(){
      expect(pinCtrl.imageMaxLength).to.be.equal(4);

      var file = new Blob(); // creates a file

      // Change the file to be added
      pinCtrl.addImagePinCreation(file.name = 'image1');

      pinCtrl.addImagePinCreation(file.name = 'image2');

      pinCtrl.addImagePinCreation(file.name = 'image3');

      pinCtrl.addImagePinCreation(file.name = 'image4');

      expect(pinCtrl.pinModel.images.length).to.be.equal(4);

      // Not added
      pinCtrl.addImagePinCreation(file.name = 'image5');

      expect(pinCtrl.pinModel.images.length).to.be.equal(4);
      expect(pinCtrl.fullImages).to.be.true;
    });

    it('should remove the image in the passed position from the model', function(){
      var file1 = new Blob(); // creates a file
      var file2 = new Blob(); // creates a file
      var file3 = new Blob(); // creates a file

      file1.name = 'name1';
      file2.name = 'name2';
      file3.name = 'name3';

      pinCtrl.addImagePinCreation(file1);
      pinCtrl.addImagePinCreation(file2);
      pinCtrl.addImagePinCreation(file3);

      expect(pinCtrl.pinModel.images.length).to.be.equal(3);

      pinCtrl.removeImage(1);

      expect(pinCtrl.pinModel.images.length).to.be.equal(2);
      expect(pinCtrl.pinModel.images).to.contain(file1);
      expect(pinCtrl.pinModel.images).to.contain(file3);
      expect(pinCtrl.pinModel.images).not.to.contain(file2);
    });

    it('should remove the location in the passed position from the model', function(){
      var place = pinCtrl.place;
      sinon.stub(pinCtrl.place.geometry.location,'lat').returns(location.Lat);
      sinon.stub(pinCtrl.place.geometry.location,'lng').returns(location.Lng);
      pinCtrl.place.name = 'location1';

      pinCtrl.addLocationPinCreation();

      pinCtrl.place = place;
      pinCtrl.place.name = 'location2';

      pinCtrl.addLocationPinCreation();

      expect(pinCtrl.pinModel.location.length).to.be.equal(2);

      var location1 = pinCtrl.pinModel.location[0];
      var location2 = pinCtrl.pinModel.location[1];

      pinCtrl.removeLocation(1);

      expect(pinCtrl.pinModel.location.length).to.be.equal(1);
      expect(pinCtrl.pinModel.location).to.contain(location1);
      expect(pinCtrl.pinModel.location).not.to.contain(location2);
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
