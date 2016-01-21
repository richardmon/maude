(function() {
  'use strict';

  angular.module('maude')
  .factory('config', function Config(){
    var config = {};

    config.facebook = {
      callbackUrl : 'http://localhost:3000/auth/facebook/callback',
    };

    return config;
  });
})();
