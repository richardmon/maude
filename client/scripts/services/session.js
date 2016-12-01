(function() {
  'use strict';

  angular.module('maude')
  .factory('session', function UserFactory($resource){
    return $resource('/auth/session');
  });
})();
