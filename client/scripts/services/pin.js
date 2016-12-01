(function() {
  'use strict';

  angular.module('maude')
  .factory('pin', function UserFactory($resource, Upload){
    var resource = $resource('/pin/:pinId/');
    var resourceComment = $resource('/pin/:pinId/comment/:commentId') 
    // resource.add({
    //   resource: 'comments',
    //   url: '/pin/:pinId/comments/:commentId'
    // });

    var service = {
      searchPins : searchPins,
      createPin : createPin,
      getPin: getPin,
      // Comments
      addComment: addComment,
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

    // Comments
    /**
     * Untested
     **/
    function addComment(pin, comment){
      var obj = {};
      angular.copy(comment, obj);
      return resourceComment.save({pinId: pin._id}, {commentId: comment._id}).$promise;
    }
  });
})();
