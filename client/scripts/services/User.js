'use strict';

angular.module('maude')
.factory('User', function UserFactory($resource){
  return $resource('/user');
})
