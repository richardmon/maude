(function(){
  'use strict';

  angular.module('maude')
    .controller('SearchController', function($scope, $window){

      activate();

      //////////////////////

      function activate(){
        $scope.$on('$viewContentLoaded', function(){
          function initMap(){
            var input = angular.element('#input-search-pins').get(0);
            var searchBox = new google.maps.places.SearchBox(input);
            searchBox.addListener('places_changed', function(){
              var places = searchBox.getPlaces();
            });
          }

          initMap();

          // Scroll to the top of the page
          $window.scrollTo(0, 0);
        });
      }

    });
})();
