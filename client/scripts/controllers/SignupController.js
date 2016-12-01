(function() {
  'use strict';

  angular.module('maude')
  .controller('SignupController', function($scope, auth, $location){
    var vm = this;
    vm.register = register;
    vm.authWithFacebook = authWithFacebook;
    vm.hasErrors = hasErrors;
    vm.errors = [];

    /////////////////////////

    function register(valid){
      if (!valid){ return; }
      auth.createUser({
        name: $scope.signup.name,
        email: $scope.signup.email,
        password: $scope.signup.password,
      }).then(registerComplete, registerFailed);
    }

    function registerComplete(user){
      //Hide de modal window using jquery
      angular.element('#signup-local-modal').modal('hide');
      //Redirect to home
      $location.path('/');
    }

    function registerFailed(err){
      vm.errors = [];
      var listErrors = err.data.errors || {all: {message: 'All fields are required'}};
      angular.forEach(listErrors, function(error, field){
        vm.errors.push({
          message: error.message,
        });
      });
    }

    function authWithFacebook(){
      auth.authenticateFacebook();
    }

    function hasErrors(){
      return vm.errors.length !== 0;
    }
  });
})();
