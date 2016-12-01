(function() {
  'use strict';

  angular.module('maude')
  .factory('auth', function($rootScope, $q, user, session, config, $window){
    var service = {
      createUser: createUser,
      loginLocal: loginLocal,
      authenticateFacebook : authenticateFacebook,
      currentUser: currentUser,
      logout: logout
    };

    return service;

    ///////////////////

    function createUser(userInfo){
      var deferred = $q.defer();
      user.save(userInfo, function(user){
        $rootScope.user = user;
        deferred.resolve(user);
      },
      function(err){
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function loginLocal(user){
      var deferred = $q.defer();
      session.save({
        email: user.email,
        password: user.password,
      }, function(user){
        $rootScope.user = user;
        deferred.resolve(user);
      }, function(err){
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function authenticateFacebook(){
      FB.getLoginStatus(function(response){
        if (response.status === 'connected'){
          $window.location.href = config.facebook.callbackUrl;
        } else {
          FB.login(function(response){
            $window.location.href = config.facebook.callbackUrl;
          },{scope: 'email'});
        }
      });
    }

    function currentUser(){
      return session.get().$promise;
    }

    function logout(){
      session.remove(function(){
        $rootScope.user = null;
      });
    }
  });
})();
