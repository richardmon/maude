'use strict';

angular.module('maude')
.controller('LoginCtrl', function($location, $scope, Auth){
  var vm = this;

  vm.loginLocal = function(valid){
    if(!valid) return;
    Auth.loginLocal({
      email: $scope.user.email,
      password: $scope.user.password
    }).then(function(user){
      $location.path('/');
      //Hide de modal window using jquery
      angular.element('#signin-modal').modal('hide');
    }, function(err){
      vm.errors = [];
      angular.forEach(err.data.errors, function(error, field){
        vm.errors.push({
          message: error.type,
        });
      });
    });
  };

  vm.authWithFacebook = function(){
    Auth.authenticateFacebook();
  }
});
