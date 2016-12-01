/*
 * Untested
 **/
(function() {
  'use strict';

  angular.module('maude')
  .factory('currentPin', function CurrentUserFactory(){
    var currentPin = {};

    return{
      getCurrentPin: getCurrentPin,
      setCurrentPin: setCurrentPin
    }

    function getCurrentPin(){
      return currentPin;
    }

    function setCurrentPin(newCurrentPin){
       currentPin = newCurrentPin;
    }
  });
})();
