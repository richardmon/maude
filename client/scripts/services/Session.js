'use strict';

angular.module('maude')
.factory('Session', function UserFactory($resource){
  return $resource('/auth/session');
});
