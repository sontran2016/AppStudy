define(function (require) {
  'use strict';
  var angular = require('angular'),
    controller = require('./controllers/home'),
    template = require('text!./templates/home.html'),
    lastestIssueTpl = require('text!./templates/detail/lastest-issue.html'),
    recentlyTroubleTpl = require('text!./templates/detail/recently-troubleshoot.html'),
    issueCountTpl = require('text!./templates/detail/issue-count.html'),
    troubleCountTpl = require('text!./templates/detail/trouble-count.html'),
    myTroubleTpl = require('text!./templates/detail/my-trouble.html'),
    troubleRatingTpl = require('text!./templates/detail/trouble-rating.html'),
    topUserTroubleTpl = require('text!./templates/detail/top-user-trouble.html'),
    issueTrackingTpl = require('text!./templates/detail/issue-tracking.html'),
    issueChartTpl = require('text!./templates/detail/issue-chart.html');

  var module = angular.module('app.home', []);

   /**
   * get list common areas
   * @param $q
   * @param commonFactory
   * @returns {*}
   */
  function getCommonArea($q,
                         commonFactory) {

    var deferred = $q.defer();
    commonFactory.getCommonArea().then(function (resp) {
      deferred.resolve(resp.data);
    });
    return deferred.promise;
  }

  /**
   * get dashboard info
   * @param $q
   * @param dashboardFactory
   * @returns {*}
   */
  function getDashboard($q,
                        dashboardFactory) {
    var deferred = $q.defer();
    dashboardFactory.getDashboard().then(function (resp) {
      deferred.resolve(resp.data);
    });
    return deferred.promise;
  }

  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('home/templates/home.html', template);
      $templateCache.put('home/templates/detail/lastest-issue.html', lastestIssueTpl);
      $templateCache.put('home/templates/detail/recently-troubleshoot.html', recentlyTroubleTpl);
      $templateCache.put('home/templates/detail/issue-count.html', issueCountTpl);
      $templateCache.put('home/templates/detail/trouble-count.html', troubleCountTpl);
      $templateCache.put('home/templates/detail/my-trouble.html', myTroubleTpl);
      $templateCache.put('home/templates/detail/trouble-rating.html', troubleRatingTpl);
      $templateCache.put('home/templates/detail/top-user-trouble.html', topUserTroubleTpl);
      $templateCache.put('home/templates/detail/issue-tracking.html', issueTrackingTpl);
      $templateCache.put('home/templates/detail/issue-chart.html', issueChartTpl);
    }]);

  module.controller('HomeController', controller);

  module.config([
    '$translatePartialLoaderProvider',
    function ($translatePartialLoaderProvider) {
      // Language
      $translatePartialLoaderProvider.addPart('javascripts/app/modules/home');
    }]);

  module.config(
    ['$stateProvider',
      function ($stateProvider) {
        $stateProvider
          .state('app.home', {
            page_title: 'Dashboard',
            ncyBreadcrumb: {
              label: 'Home'
            },
            url: '/home',
            permission: ['user', 'admin', 'Approver'],
            views: {
              'main': {
                templateUrl: "home/templates/home.html",
                controller: 'HomeController',
                controllerAs: 'vm',
                resolve: {
                  dashboardData: [
                    '$q',
                    'dashboardFactory',
                    getDashboard
                  ]
                }
              }
            }
          })
          .state('app.issueDashboard', {
          sticky: true,
          page_title: 'Issue',
          ncyBreadcrumb: {
            label: 'Issues',
            parent: 'app.home'
          },
          url: '/home/issue',
          permission: ['user', 'admin', 'Approver'],
          views: {
            'main': {
              templateUrl: "issue/templates/list.html",
              controller: 'IssueListController',
              controllerAs: 'vm',
              resolve: {
                data: [
                  '$q',
                  'commonFactory',
                  getCommonArea
                ]
              }
            }
          }
        })
        .state('app.issueOpenDashboard', {
          sticky: true,
          page_title: 'Issue',
          ncyBreadcrumb: {
            label: 'Issues',
            parent: 'app.home'
          },
          url: '/home/issue/open',
          permission: ['user', 'admin', 'Approver'],
          views: {
            'main': {
              templateUrl: "issue/templates/list.html",
              controller: 'IssueListController',
              controllerAs: 'vm',
              resolve: {
                data: [
                  '$q',
                  'commonFactory',
                  getCommonArea
                ]
              }
            }
          }
        })
        .state('app.issueCloseDashboard', {
          sticky: true,
          page_title: 'Issue',
          ncyBreadcrumb: {
            label: 'Issues',
            parent: 'app.home'
          },
          url: '/home/issue/close',
          permission: ['user', 'admin', 'Approver'],
          views: {
            'main': {
              templateUrl: "issue/templates/list.html",
              controller: 'IssueListController',
              controllerAs: 'vm',
              resolve: {
                data: [
                  '$q',
                  'commonFactory',
                  getCommonArea
                ]
              }
            }
          }
        })
        .state('app.troubleDashboard', {
          sticky: true,
          page_title: 'Troubleshoot',
          ncyBreadcrumb: {
            label: 'Troubleshoot',
            parent: 'app.home'
          },
          url: '/home/trouble',
          permission: ['user', 'admin', 'Approver'],
          views: {
            'main': {
              templateUrl: "troubleshoot/templates/list.html",
              controller: 'TroubleshootListController',
              controllerAs: 'vm',
              resolve: {
                data: [
                  '$q',
                  'commonFactory',
                  getCommonArea
                ]
              }
            }
          }
        })
        .state('app.troubleMyShootingDashboard', {
          sticky: true,
          page_title: 'Troubleshoot',
          ncyBreadcrumb: {
            label: 'Troubleshoot',
            parent: 'app.home'
          },
          url: '/home/trouble/myshooting',
          permission: ['user', 'admin', 'Approver'],
          views: {
            'main': {
              templateUrl: "troubleshoot/templates/list.html",
              controller: 'TroubleshootListController',
              controllerAs: 'vm',
              resolve: {
                data: [
                  '$q',
                  'commonFactory',
                  getCommonArea
                ]
              }
            }
          }
        })
        .state('app.troublePublicDashboard', {
          sticky: true,
          page_title: 'Troubleshoot',
          ncyBreadcrumb: {
            label: 'Troubleshoot',
            parent: 'app.home'
          },
          url: '/home/trouble/public',
          permission: ['user', 'admin', 'Approver'],
          views: {
            'main': {
              templateUrl: "troubleshoot/templates/list.html",
              controller: 'TroubleshootListController',
              controllerAs: 'vm',
              resolve: {
                data: [
                  '$q',
                  'commonFactory',
                  getCommonArea
                ]
              }
            }
          }
        })
        .state('app.troubleRejectedDashboard', {
          sticky: true,
          page_title: 'Troubleshoot',
          ncyBreadcrumb: {
            label: 'Troubleshoot',
            parent: 'app.home'
          },
          url: '/home/trouble/rejected',
          permission: ['user', 'admin', 'Approver'],
          views: {
            'main': {
              templateUrl: "troubleshoot/templates/list.html",
              controller: 'TroubleshootListController',
              controllerAs: 'vm',
              resolve: {
                data: [
                  '$q',
                  'commonFactory',
                  getCommonArea
                ]
              }
            }
          }
        })
        .state('app.troubleNotConfirmDashboard', {
          sticky: true,
          page_title: 'Troubleshoot',
          ncyBreadcrumb: {
            label: 'Troubleshoot',
            parent: 'app.home'
          },
          url: '/home/trouble/notconfirm',
          permission: ['user', 'admin', 'Approver'],
          views: {
            'main': {
              templateUrl: "troubleshoot/templates/list.html",
              controller: 'TroubleshootListController',
              controllerAs: 'vm',
              resolve: {
                data: [
                  '$q',
                  'commonFactory',
                  getCommonArea
                ]
              }
            }
          }
        })
        .state('app.troubleNeedConfirmDashboard', {
          sticky: true,
          page_title: 'Troubleshoot',
          ncyBreadcrumb: {
            label: 'Troubleshoot',
            parent: 'app.home'
          },
          url: '/home/trouble/needconfirm',
          permission: ['user', 'admin', 'Approver'],
          views: {
            'main': {
              templateUrl: "troubleshoot/templates/list.html",
              controller: 'TroubleshootListController',
              controllerAs: 'vm',
              resolve: {
                data: [
                  '$q',
                  'commonFactory',
                  getCommonArea
                ]
              }
            }
          }
        });
      }
    ]
  );

  return module.name;
});
