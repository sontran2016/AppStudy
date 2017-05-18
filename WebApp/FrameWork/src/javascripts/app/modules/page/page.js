define(function (require) {
  'use strict';
  var angular = require('angular'),
    controller = require('./controllers/page'),
    template = require('text!./templates/page.html');
  var module = angular.module('app.page', []);
  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('page/templates/page.html', template);
    }]);
  module.controller('PageController', controller);
  module.config(
    ['$stateProvider',
      function ($stateProvider) {
        $stateProvider
          .state('page', {
            url: '/page',
            templateUrl: "page/templates/page.html",
            controller: 'PageController',
            abstract: true,
            resolve: {
              authentication: [
                '$rootScope',
                '$q',
                '$location',
                'toaster',
                'userContext',
                function ($rootScope,
                          $q,
                          $location,
                          toaster,
                userContext) {
                  var deferred = $q.defer();
                  //if (angular.isObject($rootScope.currentUserInfo) && Object.keys($rootScope.currentUserInfo).length) {
                  if(userContext.authentication().isAuth){
                    toaster.pop({
                      type: "info",
                      body: "You are already signed in"
                    });
                    $location.path('/app/home');
                  } else {
                    deferred.resolve();
                  }
                  return deferred.promise;
                }
              ]
            }
          });
      }
    ]
  );
  return module.name;
});
