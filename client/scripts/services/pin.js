(function() {
  'use strict';

  angular.module('maude')
  .factory('pin', function UserFactory($resource){
    var resource = $resource('/pin');
    var service = {
      searchPins : searchPins,
      createPin : createPin
    };

    return service;

    ////////////////////////

    function searchPins(searchParams){
      return $resource('/pins').query(searchParams).$promise;
    }

    function createPin(pinModel){
      return resource.save(pinModel).$promise;
    }
  });
})();
