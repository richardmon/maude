(function(){
  'use strict';

  angular.module('maude')
    .controller('PinController', function(pin, $stateParams, $state, $scope, $window){
      var vm = this;

      // Pin Creation
      vm.pinModel = {
        location: []
      };
      vm.place;
      vm.erroCreatingPin;
      vm.contentMinLength = 100;
      vm.locationInput = '';
      vm.addLocationPinCreation = addLocationPinCreation;
      vm.create = create;

      // Pin Description
      vm.pin;

      activate();

      /////////////////////////

      function create(valid, pinModel){
        if (!valid || !pinModel.location.length){
          vm.errorCreatingPin = true;
          return;
        }
        pin.createPin(pinModel)
          .then(function(pinResponse){
            vm.errorCreatingPin = false;
            $state.go('pin', {pinId: pinResponse._id});
          }, function(err){
            vm.errorCreatingPin = true;
          });
      }

      function addLocationPinCreation(){
        if (!vm.place){
          return;
        }
        var location = {
          name: vm.place.name,
          Lat: vm.place.geometry.location.lat(),
          Lng: vm.place.geometry.location.lng()
        };
        if (!vm.pinModel.location.some(locationExist)){
          vm.pinModel.location.push(location);
        }
        vm.locationInput = '';
        vm.place = null;

        function locationExist(loc){
          return angular.equals(loc, location);
        }
      }

      function activate(){
        $scope.$on('$viewContentLoaded', function(){
          function initLocatationInput(){
            var input = angular.element('#input-location-pins').get(0);
            var autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.addListener('place_changed', function(){
              vm.place = autocomplete.getPlace();
            });
          }

          if ($state.current.name === 'pinCreate'){
            initLocatationInput();
          }

          // Scroll to the top of the page
          $window.scrollTo(0, 0);
        });

        if ($state.current.name === 'pin'){
          pin.getPin($stateParams.pinId)
            .then(function(pinResponse){
              vm.pin = pinResponse;
            });
        }
      }
    });
})();
