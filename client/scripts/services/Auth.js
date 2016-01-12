'use strict';

angular.module('maude')
.factory('Auth', function($rootScope, $q, User, Session, Config, $window){
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

    loginLocal: function LoginLocalUser(user){
      var deferred = $q.defer();
      Session.save({
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

    authenticateFacebook : function (){
      FB.getLoginStatus(function(response){
        if(response.status == 'connected'){
          $window.location.href = Config.facebook.callbackUrl;
        }
        else{
          FB.login(function(response){
            console.log(response);
            $window.location.href = Config.facebook.callbackUrl;
          },{scope: 'email'});
        }
      })
    }
  }
})
