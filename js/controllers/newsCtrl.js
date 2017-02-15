(function(){

  /*global angular */
    'use strict';

  angular.module('news').controller('newsCtrl', function($scope, $http, $q) {
    $scope.news = [];
    $scope.loadNews = function(){
        return $http.get('http://starlord.hackerearth.com/cleartrip/hackernews').then(
            function(data){
                $scope.news = data.data;
            }
        );
    };
    $scope.email = function(type,isFromBlankPage){

        // for all link elements add a style element
        var links = document.getElementsByTagName('link');
        var requestPromises = [];
        Array.prototype.forEach.call(links,function(link){
            if(link.getAttribute('rel') === 'stylesheet'){
                var httpPromise = $http.get(link.getAttribute('href')).then(function(data){
                    var styleElem = document.createElement('style');
                    styleElem.innerHTML = data.data;
                    document.head.appendChild(styleElem);
                });
                requestPromises.push(httpPromise);
            }
        });

        $q.all(requestPromises).then(function(){

            var currentHTMLPage = document.documentElement.outerHTML;
            if(isFromBlankPage){
                currentHTMLPage = currentHTMLPage.replace('<div ng-show="ShowContent" class="ng-scope ng-hide">','<div ng-show="ShowContent" class="ng-scope">');
            }
            console.log(currentHTMLPage);
            $http.post('/email/'+type,{'page':currentHTMLPage}).then(
                function(){
                    window.alert('Email Sent');
                }
            );
        });

    };

    $scope.generateAndEmail = function(type){
        $scope.loadNews().then(function(){
            $scope.email(type,true);
        });
    };

  });
}());
