'use strict';

angular.module('maude')
.factory('Auth', function($location, $rootScope, $q, User, Session){
  return {
    createUser: function CreateUser(userInfo){
      var deferred = $q.defer();
      User.save(userInfo, function(user){
        $rootScope.user = user;
        deferred.resolve(user);
      },
      function(err){
        deferred.reject(err);
      });
      return deferred.promise;
    },

    login: function LoginUser(provider, user){
      var deferred = $q.defer();
      Session.save({
        // provider : provider,
        email: user.email,
        password: user.password,
      }, function(user){
        $rootScope.user = user;
        deferred.resolve(user);
      }, function(err){
        deferred.reject(err);
      });
      return deferred.promise;
    },
  }
})
