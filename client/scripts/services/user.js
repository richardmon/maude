(function() {
  'use strict';

  angular.module('maude')
  .factory('user', function UserFactory($resource){
    return $resource('/user');
  });
})();
