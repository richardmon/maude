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
        url: '/search?input',
        templateUrl : 'views/search.html',
        controller: 'SearchController',
        controllerAs : 'searchCtrl'
      })
      .state('pin', {
        url: '/pin/details/:pinId',
        templateUrl : 'views/pin.html',
        controller: 'PinController',
        controllerAs: 'pinCtrl'
      })
      .state('pinCreate', {
        url: '/pin/create',
        templateUrl : 'views/pinCreate.html',
        controller: 'PinController',
        controllerAs: 'pinCtrl'
      })
      .state('404', {
        url: '/404'
      });
    });
})();
