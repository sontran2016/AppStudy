define(function(require) {
  'use strict';
  var angular = require('angular'),
    controller = require('./controllers/resetPassword'),
    template = require('text!./templates/resetPassword.html');
  var module = angular.module('app.resetPassword', []);
  module.run([
    '$templateCache',
    function($templateCache) {
      $templateCache.put('resetPassword/templates/resetPassword.html', template);
    }]);

  module.controller('ResetPasswordController', controller);

  module.config(
    ['$stateProvider',
      '$translatePartialLoaderProvider',
      function($stateProvider,
              $translatePartialLoaderProvider) {

        $translatePartialLoaderProvider.addPart('javascripts/app/modules/resetPassword');

        $stateProvider
          .state('page.resetPassword', {
            url: '/resetPassword/:userId/:code',
            templateUrl: "resetPassword/templates/resetPassword.html",
            controller: 'ResetPasswordController',
            authorization: false,
            controllerAs: 'vm',
            classes: ['login_page2'],
            resolve: {
              validLink: [
              'accountFactory',
              '$q',
              '$stateParams',
              function(accountFactory,
                $q,
                $stateParams) {
                var deferred = $q.defer();
                if($stateParams.userId && $stateParams.code) {
                  accountFactory.checkResetPasswordLink($stateParams.userId, $stateParams.code).success(function(resp) {
                    deferred.resolve(true);
                  }).error(function() {
                    deferred.resolve(false);
                  });
                } else {
                  deferred.resolve(false);
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
