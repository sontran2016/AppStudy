define(function (require) {
  'use strict';
  var angular = require('angular'),
    troubleshootController = require('./controllers/troubleshoot'),
    issueController = require('./controllers/issue'),
    libraryController = require('./controllers/library'),
    troubleshootTpl = require('text!./templates/troubleshoot.html'),
    issueTpl = require('text!./templates/issue.html'),
    libraryTpl = require('text!./templates/library.html');

  var module = angular.module('app.notification', []);

  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('notification/templates/troubleshoot.html', troubleshootTpl);
      $templateCache.put('notification/templates/issue.html', issueTpl);
      $templateCache.put('notification/templates/library.html', libraryTpl);
    }]);

  module.controller('TroubleshootNotificationController', troubleshootController);
  module.controller('IssueNotificationController', issueController);
  module.controller('LibraryNotificationController', libraryController);

  module.config([
    '$translatePartialLoaderProvider',
    function ($translatePartialLoaderProvider) {
      // Language
      $translatePartialLoaderProvider.addPart('javascripts/app/modules/notification');
    }]);

  module.config(
    ['$stateProvider',
      function ($stateProvider) {
        $stateProvider
          .state('app.notificationTroubleshoot', {
            page_title: 'Notification page',
            ncyBreadcrumb: {
              label: 'All Troubleshoot Notifications'
            },
            url: '/notification/troubleshoot',
            permission: ['user', 'admin', 'Approver'],
            views: {
              'main': {
                templateUrl: "notification/templates/troubleshoot.html",
                controller: 'TroubleshootNotificationController',
                controllerAs: 'vm',
                resolve: {
                  
                }
              }
            }
          })
          .state('app.notificationIssue', {
            page_title: 'Notification page',
            ncyBreadcrumb: {
              label: 'All Issue Notifications'
            },
            url: '/notification/issue',
            permission: ['user', 'admin', 'Approver'],
            views: {
              'main': {
                templateUrl: "notification/templates/issue.html",
                controller: 'IssueNotificationController',
                controllerAs: 'vm',
                resolve: {
                  
                }
              }
            }
          })
          .state('app.notificationLibrary', {
            page_title: 'Notification page',
            ncyBreadcrumb: {
              label: 'All Library Notifications'
            },
            url: '/notification/library',
            permission: ['user', 'admin', 'Approver'],
            views: {
              'main': {
                templateUrl: "notification/templates/library.html",
                controller: 'LibraryNotificationController',
                controllerAs: 'vm',
                resolve: {
                  
                }
              }
            }
          });
          
      }
    ]
  );

  return module.name;
});
