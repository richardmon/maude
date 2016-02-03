describe('Search Controller', function(){
  beforeEach(module('maude'));

  var searchCtrl;
  var scope;
  var mockPinService;
  var q;
  var deferred;
  var pinDataMock;
  var state;
  var stateParams;

  beforeEach(function(){
    // mock pin service
    mockPinService = {
      searchPins: function(){
        deferred = q.defer();
        return deferred.promise;
      }
    };
  });

  // This two beforeEach avoid problems with ui-router
  beforeEach(inject(function($templateCache) {
    $templateCache.put('views/pin.html','<div>blank or whatever</div>');
  }));

  beforeEach(inject(function($controller, $rootScope, $q, $httpBackend, $state, $stateParams){
    q = $q;
    scope = $rootScope.$new();
    stateParams = $stateParams;
    state = $state;
    // No authenticated user
    $httpBackend.whenGET('/auth/session').respond(401);

    // Mock pin

    pinDataMock = {
      title: 'TItle',
      creator: 1234,
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt inculpa qui officia deserunt mollit anim id est laborum.',
      location: {
        Lat: '123',
        Lng: '124'
      },
      available: true
    };


    searchCtrl = $controller('SearchController', {
      $scope: scope,
      $stateParams: stateParams,
      $state: state,
      pin: mockPinService
    });
  }));


  it('should open a pin based on the id and redirect to it', function(){
    var pinId = 54321;
    searchCtrl.openPin(pinId);

    scope.$digest();

    expect(state.current.name).to.be.equal('pin');
    expect(stateParams.pinId).to.be.equal(pinId.toString());

  });


  describe('Search Pin', function(){
    beforeEach(inject(function($httpBackend, $rootScope){

      // Google maps serachbox result mock
      searchCtrl.places = [{
        geometry: {
          location: {lat:function(){}, lng: function(){}}
        }
      }];

    }));

    it('should get a array of elements', function(){
      // mock result of a search
      var searchParams = {
        Lng: -57.000,
        Lat: 57.000
      };
      sinon.stub(searchCtrl.places[0].geometry.location,
          'lat',function(){return searchParams.Lat});
      sinon.stub(searchCtrl.places[0].geometry.location,
          'lng',function(){return searchParams.Lng});

      //Spy on service
      sinon.spy(mockPinService, 'searchPins');

      expect(searchCtrl.pins).be.empty;

      searchCtrl.search();

      deferred.resolve([pinDataMock]);
      scope.$digest();

      expect(searchCtrl.pins).not.be.empty;
      expect(searchCtrl.pins).to.be.instanceOf(Array);


      expect(searchCtrl.places[0].geometry.location.lat.called).to.be.true;
      expect(searchCtrl.places[0].geometry.location.lng.called).to.be.true;

      expect(mockPinService.searchPins.calledWith(searchParams)).to.be.true;
    });
  });

});
