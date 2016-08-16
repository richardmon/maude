(function() {
  'use strict';

  angular.module('maude')
    .factory('comment', function Comment($resource){
      var resource = $resource('/comment/:commentId');
      var service = {
        getComment: getComment,
        deleteComment: deleteComment
      };
      return service;

      ////////////////////////

      function getComment(commentId){
        return resource.get({commentId: commentId}).$promise;
      }

      function deleteComment(commentId){
        return resource.delete({commentId: commentId}).$promise;
      }
    });
})();
