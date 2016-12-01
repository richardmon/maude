(function(){
  'use strict';

  angular.module('maude')
    .controller('CommentController', function commentController($scope, currentPin, comment, pin, $state){
      var vm = this;
      //Variables
      vm.comments = [];
      //Functions
      vm.getComments = getComments;
      vm.addComment = addComment;


      activate();
      /////////////////////////

      function getComments(commentsIdsArray){
        vm.comments = [];
        commentsIdsArray = commentsIdsArray || [];
        commentsIdsArray.forEach(function(commentId){
          comment.getComment(commentId)
            .then(function(fullComment){
              vm.comments.push(fullComment);
            });
        });
      }

      /**
       * Untested
       **/
      function addComment(newComment){
        var currentPinNow = currentPin.getCurrentPin();
        comment.createComment(newComment).then(function(commentCreated){
          pin.addComment(currentPinNow, commentCreated).then(function(newPin){
            currentPin.setCurrentPin(newPin);
          });
        });
      }

      /**
       * Untested
       **/
      function activate(){
        if ($state.current.name === 'pin'){
          getComments(currentPin.getCurrentPin().comments);
          $scope.$watch(function(){
            return currentPin.getCurrentPin(); //Look up for comment changes
          }, function(newPin, oldPin){
            getComments(newPin.comments);
          })
        }
      }

    });
})();
