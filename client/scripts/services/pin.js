(function() {
  'use strict';

  angular.module('maude')
  .factory('pin', function UserFactory($resource){
    var resource = $resource('/pin/:pinId');
    var service = {
      searchPins : searchPins,
      createPin : createPin,
      getPin: getPin
    };

    return service;

    ////////////////////////

    function searchPins(searchParams){
      return $resource('/pins').query(searchParams).$promise;
    }

    function createPin(pinModel){
      return resource.save(pinModel).$promise;
    }

    function getPin(pinId){
      return resource.get({pinId: pinId}).$promise;
    }
  });
})();
