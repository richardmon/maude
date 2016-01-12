'use strict';

angular.module('maude')
.service('Config', function(){
  this.facebook = {
    callbackUrl : "http://localhost:3000/auth/facebook/callback",
  }
})
