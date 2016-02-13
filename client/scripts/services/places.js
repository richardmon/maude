
(function() {
  'use strict';

  angular.module('maude')
  .factory('places', function places(){
    var places = {
      places: []
    };

    return places;
  });
})();
