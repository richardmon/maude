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
      .state('profile', {
        url: '/profile/me',
        templateUrl: 'views/profileMe.html',
        controller: 'ProfileController',
        controllerAs : 'profileCtrl'
      })
      .state('404', {
        url: '/404'
      });
    });
})();
