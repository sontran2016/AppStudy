define(function (require) {
  'use strict';
  var angular = require('angular'),
    howToUseController = require('./controllers/howToUse'),
    howToUseTpl = require('text!./templates/howToUse.html');

  var module = angular.module('app.howToUse', []);

  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('howToUse/templates/howToUse.html', howToUseTpl);
    }]);

  module.controller('HowToUseController', howToUseController);

  module.config([
    '$translatePartialLoaderProvider',
    function ($translatePartialLoaderProvider) {
      // Language
      $translatePartialLoaderProvider.addPart('javascripts/app/modules/howToUse');
    }]);

  module.config(
    ['$stateProvider',
      function ($stateProvider) {
        $stateProvider
          .state('app.howToUse', {
            page_title: 'How To Use',
            ncyBreadcrumb: {
              label: 'How To Use'
            },
            url: '/howToUse',
            permission: ['user', 'admin', 'Approver'],
            views: {
              'main': {
                templateUrl: "howToUse/templates/howToUse.html",
                controller: 'HowToUseController',
                controllerAs: 'vm',
                resolve: {}
              }
            }
          })
          .state('app.howToUseForgotPassword', {
            page_title: 'How To Use',
            ncyBreadcrumb: {
              label: 'How To Use - Forgot Password'
            },
            url: '/howToUse/forgotPassword',
            permission: ['user', 'admin', 'Approver'],
            views: {
              'main': {
                templateUrl: "howToUse/templates/howToUse.html",
                controller: 'HowToUseController',
                controllerAs: 'vm',
                resolve: {}
              }
            }
          })
          .state('app.howToUseArea', {
            page_title: 'How To Use',
            ncyBreadcrumb: {
              label: 'How To Use - Area Management'
            },
            url: '/howToUse/areaManagement',
            permission: ['user', 'admin', 'Approver'],
            views: {
              'main': {
                templateUrl: "howToUse/templates/howToUse.html",
                controller: 'HowToUseController',
                controllerAs: 'vm',
                resolve: {}
              }
            }
          })
          .state('app.howToUseLine', {
            page_title: 'How To Use',
            ncyBreadcrumb: {
              label: 'How To Use - Line Management'
            },
            url: '/howToUse/lineManagement',
            permission: ['user', 'admin', 'Approver'],
            views: {
              'main': {
                templateUrl: "howToUse/templates/howToUse.html",
                controller: 'HowToUseController',
                controllerAs: 'vm',
                resolve: {}
              }
            }
          })
          .state('app.howToUseMachine', {
            page_title: 'How To Use',
            ncyBreadcrumb: {
              label: 'How To Use - Machine Management'
            },
            url: '/howToUse/machineManagement',
            permission: ['user', 'admin', 'Approver'],
            views: {
              'main': {
                templateUrl: "howToUse/templates/howToUse.html",
                controller: 'HowToUseController',
                controllerAs: 'vm',
                resolve: {}
              }
            }
          })
          .state('app.howToUseComponent', {
            page_title: 'How To Use',
            ncyBreadcrumb: {
              label: 'How To Use - Component Management'
            },
            url: '/howToUse/componentManagement',
            permission: ['user', 'admin', 'Approver'],
            views: {
              'main': {
                templateUrl: "howToUse/templates/howToUse.html",
                controller: 'HowToUseController',
                controllerAs: 'vm',
                resolve: {}
              }
            }
          })
          .state('app.howToUseSymptom', {
            page_title: 'How To Use',
            ncyBreadcrumb: {
              label: 'How To Use - Symptom Management'
            },
            url: '/howToUse/symptomManagement',
            permission: ['user', 'admin', 'Approver'],
            views: {
              'main': {
                templateUrl: "howToUse/templates/howToUse.html",
                controller: 'HowToUseController',
                controllerAs: 'vm',
                resolve: {}
              }
            }
          })
          .state('app.howToUsePotentialCause', {
            page_title: 'How To Use',
            ncyBreadcrumb: {
              label: 'How To Use - Potential Cause Management'
            },
            url: '/howToUse/potentialCauseManagement',
            permission: ['user', 'admin', 'Approver'],
            views: {
              'main': {
                templateUrl: "howToUse/templates/howToUse.html",
                controller: 'HowToUseController',
                controllerAs: 'vm',
                resolve: {}
              }
            }
          })
          .state('app.howToUseTroubleshoot', {
            page_title: 'How To Use',
            ncyBreadcrumb: {
              label: 'How To Use - Troubleshoot Management'
            },
            url: '/howToUse/troubleshootManagement',
            permission: ['user', 'admin', 'Approver'],
            views: {
              'main': {
                templateUrl: "howToUse/templates/howToUse.html",
                controller: 'HowToUseController',
                controllerAs: 'vm',
                resolve: {}
              }
            }
          })
          .state('app.howToUseIssue', {
            page_title: 'How To Use',
            ncyBreadcrumb: {
              label: 'How To Use - Issue Management'
            },
            url: '/howToUse/issueManagement',
            permission: ['user', 'admin', 'Approver'],
            views: {
              'main': {
                templateUrl: "howToUse/templates/howToUse.html",
                controller: 'HowToUseController',
                controllerAs: 'vm',
                resolve: {}
              }
            }
          })
          .state('app.howToUseUser', {
            page_title: 'How To Use',
            ncyBreadcrumb: {
              label: 'How To Use - User Management'
            },
            url: '/howToUse/userManagement',
            permission: ['user', 'admin', 'Approver'],
            views: {
              'main': {
                templateUrl: "howToUse/templates/howToUse.html",
                controller: 'HowToUseController',
                controllerAs: 'vm',
                resolve: {}
              }
            }
          })
          .state('app.howToUseTag', {
            page_title: 'How To Use',
            ncyBreadcrumb: {
              label: 'How To Use - Tag Management'
            },
            url: '/howToUse/tagManagement',
            permission: ['user', 'admin', 'Approver'],
            views: {
              'main': {
                templateUrl: "howToUse/templates/howToUse.html",
                controller: 'HowToUseController',
                controllerAs: 'vm',
                resolve: {}
              }
            }
          });
          
      }
    ]
  );

  return module.name;
});
