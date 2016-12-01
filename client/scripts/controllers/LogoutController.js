(function() {
  'use strict';

  angular.module('maude')
  .controller('LogoutController', function(auth){
    var vm = this;
    vm.logoutUser = logoutUser;

    ///////////////////

    function logoutUser(){
      auth.logout();
    }
  });
})();
