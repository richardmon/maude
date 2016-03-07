(function() {
  'use strict';

  angular.module('maude')
  .factory('pin', function UserFactory($resource, Upload){
    var resource = $resource('/pin/:pinId');
    var service = {
      searchPins : searchPins,
      createPin : createPin,
      getPin: getPin
    };

    return service;

    ////////////////////////

    function searchPins(searchParams){
      return $resource('/pins').query(searchParams).$promise;
    }

    function createPin(pinModel){
      var obj = {};
      angular.copy(pinModel, obj);
      obj.location = Upload.json(obj.location);
      obj.images = pinModel.images;

      var upload = Upload.upload({
        url: 'pin',
        data: obj,
        arrayKey: ''
      });
      return upload;
    }

    function getPin(pinId){
      return resource.get({pinId: pinId}).$promise;
    }
  });
})();
