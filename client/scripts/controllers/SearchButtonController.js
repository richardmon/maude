(function() {
  'use strict';

  angular.module('maude')
  .controller('SearchButtonController', function($state){
    var vm = this;
    vm.visible = visible;

    ///////////////////

    function visible(){
      if ($state.current.name === 'search'){
        return false;
      }

      return true;
    }

  });
})();
