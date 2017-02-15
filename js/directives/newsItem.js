(function(){

  /*global angular */
  'use strict';

  /**
   * Directive that places focus on the element it is applied to when the expression it binds to evaluates to true
   */
  angular.module('news').directive('newsItem', function () {
    return {
        restrict : 'AE',
        scope : {
            'news' : '=data'
        },
        templateUrl : 'templates/newsItem.html'
    };
  });

}());
