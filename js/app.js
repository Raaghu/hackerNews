(function(){

  /*global angular */
  /*jshint unused:false */
  'use strict';

/**
 * The main Hacker News app module
 *
 * @type {angular.Module}
 */
  angular.module('news', ['ngRoute'])
    .config(function($routeProvider){
      $routeProvider
        .when('/page1', {
          templateUrl: 'templates/page1.html'
        })
        .when('/page2', {
          templateUrl: 'templates/page2.html'
        })
        .otherwise({redirectTo: '/'});
    });

}());
