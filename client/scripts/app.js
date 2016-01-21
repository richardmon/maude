(function() {
  'use strict';

  angular.module('maude', ['ngResource'])
  // Facebook SDK, for more information https://developers.facebook.com/docs/javascript/howto/angularjs
  .run(function($window){
    $window.fbAsyncInit = function() {
      FB.init({
        appId: '904326619684001',
        status: true,
        cookie: true,
        xfbml: true,
        version: 'v2.4'
      });
    };
  })

  .run(function(auth, $rootScope){
    auth.currentUser().then(function(user){
      $rootScope.user = user;
    });
  });
})();
