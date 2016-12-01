(function(){
  'use strict';

  angular.module('maude')
    .controller('PinController', function(pin, currentPin, $stateParams, $state, $scope, $window){
      var vm = this;

      // Pin Creation
      vm.pinModel = {
        location: [],
        images: []
      };
      vm.place;
      vm.errorCreatingPin = false;
      vm.contentMinLength = 100;
      vm.imageMaxLength = 4;
      vm.imageDuplicated = false;
      vm.fullImages = false;
      vm.locationInput = '';
      vm.addLocationPinCreation = addLocationPinCreation;
      vm.removeLocation = removeLocation;
      vm.addImagePinCreation = addImagePinCreation;
      vm.removeImage = removeImage;
      vm.create = create;
      // Helpers for the view
      vm.imageError = imageError;
      vm.visibleImage;

      // Pin Description
      vm.getVisibleImage = getVisibleImage;
      vm.pin;

      activate();

      /////////////////////////

      function create(valid, pinModel){
        if (!valid || vm.imageError() || !pinModel.location.length){
          vm.errorCreatingPin = true;
          return;
        }
        pin.createPin(pinModel)
          .then(function(pinResponse){
            vm.errorCreatingPin = false;
            $state.go('pin', {pinId: pinResponse.data._id});
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

      function removeLocation(i){
        vm.pinModel.location.splice(i,1);
      }

      function addImagePinCreation(image){
        if (!image){
          return;
        }
        if (vm.pinModel.images.length < vm.imageMaxLength &&
            !vm.pinModel.images.some(imageExist)){
          vm.imageDuplicated = false;
          vm.fullImages = false;
          vm.pinModel.images.push(image);
        } else if (vm.pinModel.images.some(imageExist)){
          vm.imageDuplicated = true;
        } else if (vm.pinModel.images.length >= vm.imageMaxLength){
          vm.fullImages = true;
        }

        function imageExist(img){
          var imgJson = angular.toJson(img);
          var imageJson = angular.toJson(image);
          return angular.equals(imgJson, imageJson);
        }
      }

      function removeImage(i){
        vm.pinModel.images.splice(i,1);
      }

      function getVisibleImage(i){
        var imageSelected = i || 0;
        if (vm.pin && vm.pin.images){
          vm.visibleImage = vm.pin.images[imageSelected];
          return vm.visibleImage;
        }
      }

      //Helpers

      function imageError(){
        return vm.imageDuplicated || vm.fullImages;
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
              currentPin.setCurrentPin(pinResponse);
              vm.pin = currentPin.getCurrentPin();
            });

          $scope.$watch(function(){
            return currentPin.getCurrentPin();
          }, function(newPin, oldPin){
            vm.pin = newPin;
          })
        }
      }
    });
})();
