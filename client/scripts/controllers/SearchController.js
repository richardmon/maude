(function(){
  'use strict';

  angular.module('maude')
    .controller('SearchController', function($scope, $window, $state, pin){
      var vm = this;
      vm.pins = [];
      vm.places;
      vm.openPin = openPin;
      vm.search = search;

      activate();

      //////////////////////

      function openPin(pinId){
        $state.go('pin', {pinId: pinId});
      }

      function search(){
        var searchParams = {};
        searchParams.lat = vm.places[0].geometry.location.lat();
        searchParams.lng = vm.places[0].geometry.location.lng();

        pin.searchPins(searchParams).then(function(pinDataArray){
          vm.pins = pinDataArray;
        })

      }

      function activate(){
        $scope.$on('$viewContentLoaded', function(){
          function initMap(){
            var input = angular.element('#input-search-pins').get(0);
            var searchBox = new google.maps.places.SearchBox(input);
            searchBox.addListener('places_changed', function(){
              vm.places = searchBox.getPlaces();
              console.log(places);
            });
          }

          initMap();

          // Scroll to the top of the page
          $window.scrollTo(0, 0);
        });
      }

    });
})();
