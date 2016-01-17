'use strict';

angular.module('maude')
.controller('LogoutCtrl', function(Auth){
  var vm = this;

  vm.logoutUser = function(){
    Auth.logout();
  }
});
