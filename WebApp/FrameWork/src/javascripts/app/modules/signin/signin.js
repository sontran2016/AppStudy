define(function(require) {
  'use strict';
  var angular = require('angular'),
    controller = require('./controllers/signin'),
    template = require('text!./templates/signin.html');
  var module = angular.module('app.signin', []);
  module.run([
    '$templateCache',
    function($templateCache) {
      $templateCache.put('signin/templates/signin.html', template);
    }]);

  module.controller('SignInController', controller);

  module.config([
    '$translatePartialLoaderProvider',
    function ($translatePartialLoaderProvider) {
      // Language
      $translatePartialLoaderProvider.addPart('javascripts/app/modules/signin');
    }]);

  module.config(
    ['$stateProvider',
      function($stateProvider) {
        $stateProvider
          .state('page.signin', {
            url: '/signin',
            templateUrl: "signin/templates/signin.html",
            controller: 'SignInController',
            authorization: false,
            controllerAs: 'vm',
            classes: ['login_page2']
          });
      }
    ]
  );

  return module.name;
});
