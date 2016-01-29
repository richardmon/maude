(function() {
  'use strict';

  angular.module('maude')
    .config(function($stateProvider, $urlRouterProvider){

      $urlRouterProvider.otherwise('/');

      $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/home.html'
      })
      .state('search', {
        url: '/search',
        templateUrl : 'views/search.html',
        controller: 'SearchController',
        controllerAs : 'searchCtrl'
      })
      .state('pin', {
        url: '/pins',
        templateUrl : 'views/pin.html'
      });
    });
})();
