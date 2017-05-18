define(function(require) {
  'use strict';
  var angular = require('angular'),
    controller = require('./controllers/forgotPassword'),
    template = require('text!./templates/forgotPassword.html');
  var module = angular.module('app.forgotPassword', []);
  module.run([
    '$templateCache',
    function($templateCache) {
      $templateCache.put('forgotPassword/templates/forgotPassword.html', template);
    }]);

  module.controller('ForgotPasswordController', controller);

  module.config(
    ['$stateProvider',
      '$translatePartialLoaderProvider',
      function($stateProvider, $translatePartialLoaderProvider) {
        // Language
        $translatePartialLoaderProvider.addPart('javascripts/app/modules/forgotPassword');

        $stateProvider
          .state('page.forgotPassword', {
            url: '/forgot-password',
            templateUrl: "forgotPassword/templates/forgotPassword.html",
            controller: 'ForgotPasswordController',
            authorization: false,
            controllerAs: 'vm',
            classes: ['login_page2']
          });
      }
    ]
  );

  return module.name;
});
