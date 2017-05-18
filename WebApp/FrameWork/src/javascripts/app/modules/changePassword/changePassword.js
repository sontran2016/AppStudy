define(function(require) {
  'use strict';
  var angular = require('angular'),
    controller = require('./controllers/changePassword'),
    template = require('text!./templates/changePassword.html');

  var module = angular.module('app.changePassword', []);

  module.run([
    '$templateCache',
    function($templateCache) {
      $templateCache.put('changePassword/templates/changePassword.html', template);
    }
  ]);

  module.controller('ChangePasswordController', controller);

  module.config([
    '$stateProvider',
    '$translatePartialLoaderProvider',
    function($stateProvider, $translatePartialLoaderProvider) {
      // Language
      $translatePartialLoaderProvider.addPart('javascripts/app/modules/changePassword');

      $stateProvider
        .$state('app.changePassword', {
          page_title: 'Change Password page',
          ncyBreadcrumb: {
            label: 'Change Password page'
          },
          url: '/change-password',
          permission: ['user', 'admin', 'Approver'],
          views: {
            'main': {
              templateUrl: "changePassword/templates/changePassword.html",
              controller: 'ChangePasswordController',
              controllerAs: 'vm'
            }
          }
        });
    }
  ]);

  return module.name;
});
