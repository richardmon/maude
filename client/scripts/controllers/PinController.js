(function(){
  'use strict';

  angular.module('maude')
    .controller('PinController', function(pin, $stateParams, $state){
      var vm = this;
      vm.create = create;
      vm.erroCreatingPin;

      /////////////////////////

      function create(pinModel){
        pin.createPin(pinModel)
          .then(function(pinId){
            vm.errorCreatingPin = false;
            $state.go('pin', {pinId: pinId});
          }, function(err){
            vm.errorCreatingPin = true;
          });
      }
    });
})();
