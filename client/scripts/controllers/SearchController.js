(function(){
  'use strict';

  angular.module('maude')
    .controller('SearchController', function($scope, $window, $state, pin, $stateParams){
      var vm = this;
      vm.pins = [];
      vm.places = [];
      vm.input = $stateParams.input || '';
      vm.openPin = openPin;
      vm.search = search;
      vm.submit = submit;
      vm.inputExist = inputExist;

      activate();

      //////////////////////

      function openPin(pinId){
        $state.go('pin', {pinId: pinId});
      }

      function search(){
        if (vm.places.length){
          var searchParams = {};
          searchParams.Lat = vm.places[0].geometry.location.lat();
          searchParams.Lng = vm.places[0].geometry.location.lng();

          pin.searchPins(searchParams).then(function(pinDataArray){
            vm.pins = pinDataArray;
          });
        } else {
          vm.pins = [];
        }
      }

      function submit(input){
        if (input.length){
          $state.go('search', {input: input});
        }
      }

      function inputExist(){
        return $stateParams.input &&  $stateParams.input.length;
      }

      function activate(){
        $scope.$on('$viewContentLoaded', function(){
          // Autocompletion in the search input
          var input = angular.element('#input-search-pins').get(0);
          var searchBox = new google.maps.places.SearchBox(input);
          searchBox.addListener('places_changed', function(){
            vm.submit(input.value);
          });

          // Finds location based on the query
          if ($stateParams.input){
            var map = new google.maps.Map(angular.element('#map').get(0));

            var request = {
              query : $stateParams.input
            };

            var service = new google.maps.places.PlacesService(map);
            service.textSearch(request, callback);

          }

          function callback(results, status){
            if (status === google.maps.places.PlacesServiceStatus.OK){
              vm.places = results;
              vm.search();
            }
          }

          // Scroll to the top of the page
          $window.scrollTo(0, 0);
        });
      }

    });
})();
