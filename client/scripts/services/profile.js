(function(){
  'use strict';

  angular.module('maude')
    .factory('profile', function ProfileFactory($resource){
      var resource = $resource('/profile/:userId');

      var service = {
        get: get
      };

      return service;

      /////////////////////

      function get(userId){
        return resource.get({userId: userId}).$promise;
      }

    });
})();
