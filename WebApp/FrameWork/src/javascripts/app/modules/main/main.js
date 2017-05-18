define(function (require) {
  'use strict';
  var angular = require('angular'),
    controller = require('./controllers/main'),
    template = require('text!./templates/main.html');
  var module = angular.module('app.main', []);
  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('main/templates/main.html', template);
    }]);
  module.controller('MainController', controller);
  module.config(
    ['$stateProvider',
      function ($stateProvider) {
        $stateProvider
          .$state('app', {
            url: '/app',
            templateUrl: "main/templates/main.html",
            controller: 'MainController',
            controllerAs: 'vm',
            abstract: true,
            resolve: {
              userInfo: [
                'accountFactory',
                'userContext',
                '$q',
                '$location',
                '$state',
                '$rootScope',
                function (accountFactory,
                          userContext,
                          $q,
                          $location,
                          $state,
                          $rootScope) {

                  var deferred = $q.defer();

                  if ($state.previous && $state.previous.name === "page.signin") {
                    $rootScope.saveState = null;
                    deferred.resolve();
                  }
                  else {
                    // accountFactory.updateUserInfo()
                    //   .then(function () {
                    //     $rootScope.saveState = null;
                        deferred.resolve();
                      // }, function (err) {
                      //   $location.path('/page/signin');
                      //   deferred.reject();
                      // });
                  }

                  return deferred.promise;
                }]
            }
          });
      }
    ]
  );
  return module.name;
});
