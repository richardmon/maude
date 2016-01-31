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
        url: '/pin/:pinId',
        templateUrl : 'views/pin.html',
        controller: 'PinController',
        controllerAs: 'pinCtrl'
      })
      .state('404', {
        url: '/404'
      });
    });
})();
