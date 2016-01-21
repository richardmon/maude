(function() {
  'use strict';

  angular.module('maude')
  .controller('LoginController', function($location, $scope, auth){
    var vm = this;
    vm.loginLocal = loginLocal;
    vm.authWithFacebook = authWithFacebook;
    vm.hasErrors  = hasErrors;
    vm.errors = [];

    ///////////////////////

    function loginLocal(valid){
      if (!valid) { return; }
      auth.loginLocal({
        email: $scope.siginin.email,
        password: $scope.siginin.password
      }).then(loginLocalComplete, loginLocalFailed);
    }

    function loginLocalComplete(user){
      $location.path('/');
      //Hide de modal window using jquery
      angular.element('#signin-modal').modal('hide');
    }

    function loginLocalFailed(err){
      vm.errors = [];
      angular.forEach(err.data.errors, function(error, field){
        vm.errors.push({
          message: error.type,
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
