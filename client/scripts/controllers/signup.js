'use strict';

angular.module('maude')
.controller('SignupController', function($scope, Auth, $location){
  var vm = this;

  vm.register = function(valid){
    if(!valid) return;
    Auth.createUser({
      name: $scope.user.name,
      email: $scope.user.email,
      password: $scope.user.password,
    }).then(function(user){
        //Hide de modal window using jquery
        angular.element('#signup-local-modal').modal('hide');

        $location.path('/');
    }, function(err){
      vm.errors = [];
      var list_errors = err.data.errors || {all: {message: "All fields are required"}};
      angular.forEach(list_errors, function(error, field){
        vm.errors.push({
          message: error.message,
        });
      });
    });
  };
})
