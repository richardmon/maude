(function() {
  'use strict';

  angular.module('maude')
  .factory('pin', function UserFactory($resource){
    var resource = $resource('/pin');
    var service = {
      searchPins : searchPins,
    };

    return service;

    ////////////////////////

    function searchPins(searchParams){
      return resource.query(searchParams).$promise;
    }
  });
})();
