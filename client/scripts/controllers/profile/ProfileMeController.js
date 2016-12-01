(function(){
  'use strict';

  angular.module('maude')
    .controller('ProfileMeController', function ProfileMeController($rootScope, profile) {
      var vm = this;
      vm.profile;
      vm.getMe = getMe;

      activate();

      //////////////////////77

      function getMe() {
        var me = $rootScope.user && $rootScope.user._id;
        if (me){
          profile.get(me)
            .then(function(me){
              vm.profile = me;
            });
        }
      }

      function activate(){
        vm.getMe();
      }
    });
})();
