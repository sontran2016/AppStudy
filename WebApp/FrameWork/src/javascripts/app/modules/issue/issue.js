define(function (require) {
  'use strict';
  var angular = require('angular'),

    issueListController = require('./controllers/list'),
    issueAddController = require('./controllers/add'),
    issueEditController = require('./controllers/edit'),
    issueDetailsController = require('./controllers/details'),
    rejectIssueController = require('./controllers/modal/rejectIssue'),
    notifyChangedIssueController = require('./controllers/modal/notifyChangedIssue'),
    addShootingController = require('./controllers/modal/addShooting'),
    viewShootingController = require('./controllers/modal/viewShooting'),
    suggestIssueDetailController = require('./controllers/modal/issueDetail'),

    listTpl = require('text!./templates/list.html'),
    addTpl = require('text!./templates/add.html'),
    editTpl = require('text!./templates/edit.html'),
    detailsTpl = require('text!./templates/details.html'),
    rejectIssueTpl = require('text!./templates/modal/rejectIssue.html'),
    addShootingTpl = require('text!./templates/modal/addShooting.html'),
    viewShootingTpl = require('text!./templates/modal/viewShooting.html'),
    suggestIssueDetailTpl = require('text!./templates/modal/issueDetail.html'),
    notifyChangedTpl = require('text!./../../common/templates/notifyChanged.html');
  var module = angular.module('app.issue', []);

  module.config([
    '$translatePartialLoaderProvider',
    function ($translatePartialLoaderProvider) {
      // Language
      $translatePartialLoaderProvider.addPart('javascripts/app/modules/issue');
    }]);

  /**
   * Pre load language for site
   * @param $q
   * @param $translate
   * @returns {*}
   */
  function preLoadLanguages($q, $translate) {
    var deferred = $q.defer();
    $translate('ISSUE.HEADING').then(function (translation) {
      deferred.resolve();
    });
    return deferred.promise;
  }

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
   * get list common lines
   * @param $q
   * @param $stateParams
   * @param issueFactory
   * @param commonFactory
   * @returns {*}
   */
  function getCommonLine($q,
                         $stateParams,
                         issueFactory,
                         commonFactory) {

    var deferred = $q.defer();
    var issueId = $stateParams.id;
    issueFactory.getDetails(issueId).then(function (issueResp) {
      var param = {
        areaId: issueResp.data.area.id
      };
      commonFactory.getCommonLine(param).then(function (resp) {
        deferred.resolve(resp.data);
      });
    });
    return deferred.promise;
  }

  /**
   * get list common machines
   * @param $q
   * @param $stateParams
   * @param issueFactory
   * @param commonFactory
   * @returns {*}
   */
  function getCommonMachine($q,
                         $stateParams,
                         issueFactory,
                         commonFactory) {

    var deferred = $q.defer();
    var issueId = $stateParams.id;
    issueFactory.getDetails(issueId).then(function (issueResp) {
      var param = {
        lineId: issueResp.data.line.id
      };
      commonFactory.getCommonMachine(param).then(function (resp) {
        deferred.resolve(resp.data);
      });
    });
    return deferred.promise;
  }

  /**
   * get list common components
   * @param $q
   * @param $stateParams
   * @param issueFactory
   * @param commonFactory
   * @returns {*}
   */
  function getCommonComponent($q,
                            $stateParams,
                            issueFactory,
                            commonFactory) {

    var deferred = $q.defer();
    var issueId = $stateParams.id;
    issueFactory.getDetails(issueId).then(function (issueResp) {
      var param = {
        machineId: issueResp.data.machine.id
      };
      commonFactory.getCommonComponent(param).then(function (resp) {
        deferred.resolve(resp.data);
      });
    });
    return deferred.promise;
  }

  /**
   * getIssueModel
   * @param $q
   * @param $stateParams
   * @param issueFactory
   * @returns {*}
   */
  function getIssueModel($q,
                         $stateParams,
                         issueFactory) {
    var issueId = $stateParams.id;

    var deferred = $q.defer();
    issueFactory.getDetails(issueId).then(function (resp) {
      deferred.resolve(resp.data);
    });
    return deferred.promise;
  }

    /**
   * Get troubleshoot
   * @param $q
   * @param $stateParams
   * @param troubleshootFactory
   * @returns {*}
   */
  function getTroubleshootModel($q,
                                $stateParams,
                                troubleshootFactory) {
    var troubleshootId = $stateParams.troubleId;
    var deferred = $q.defer();

    troubleshootFactory.getDetails(troubleshootId).then(function (resp) {
      deferred.resolve(resp.data);
    });
    return deferred.promise;
  }

   /**
   * Get user info
   * @param $q
   * @param accountFactory
   * @returns {*}
   */
  function getUserInfo($q,
                      accountFactory) {
    var deferred = $q.defer();
    accountFactory.getUserInfo().then(function (resp) {
      deferred.resolve(resp.data);
    });
    return deferred.promise;
  }

  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('issue/templates/list.html', listTpl);
      $templateCache.put('issue/templates/add.html', addTpl);
      $templateCache.put('issue/templates/edit.html', editTpl);
      $templateCache.put('issue/templates/details.html', detailsTpl);
      $templateCache.put('issue/templates/modal/rejectIssue.html', rejectIssueTpl);
      $templateCache.put('issue/templates/modal/addShooting.html', addShootingTpl);
      $templateCache.put('issue/templates/modal/viewShooting.html', viewShootingTpl);
      $templateCache.put('issue/templates/modal/issueDetail.html', suggestIssueDetailTpl);
      $templateCache.put('common/templates/notifyChanged.html', notifyChangedTpl);
    }]);

  module.controller('IssueListController', issueListController);
  module.controller('IssueAddController', issueAddController);
  module.controller('IssueEditController', issueEditController);
  module.controller('IssueDetailsController', issueDetailsController);
  module.controller('RejectIssueController', rejectIssueController);
  module.controller('AddShootingController', addShootingController);
  module.controller('ViewShootingController', viewShootingController);
  module.controller('SuggestIssueDetailController', suggestIssueDetailController);
  module.controller('NotifyChangedIssueController', notifyChangedIssueController);

  module.config([
    '$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('app.issue', {
          sticky: true,
          page_title: 'Issue',
          ncyBreadcrumb: {
            label: 'Issues'
          },
          url: '/issue',
          permission: ['user', 'admin', 'Approver'],
          views: {
            'main': {
              templateUrl: "issue/templates/list.html",
              controller: 'IssueListController',
              controllerAs: 'vm',
              resolve: {
                languages: [
                  '$q',
                  '$translate',
                  preLoadLanguages
                ],
                data: [
                  '$q',
                  'commonFactory',
                  getCommonArea  
                ]
              }
            }
          }
        })

        .state('app.issueAdd', {
          sticky: true,
          page_title: 'New Issue',
          ncyBreadcrumb: {
            label: 'New Issue',
            parent: 'app.issue'
          },
          url: '/issue/add',
          permission: ['user', 'admin', 'Approver'],
          views: {
            'main': {
              templateUrl: "issue/templates/add.html",
              controller: 'IssueAddController',
              controllerAs: 'vm',
              resolve: {
                languages: [
                  '$q',
                  '$translate',
                  preLoadLanguages
                ],
                data: [
                  '$q',
                  'commonFactory',
                  getCommonArea
                ],
                user: [
                  '$q',
                  'accountFactory',
                  getUserInfo
                ]
              }
            }
          }
        })
        .state('app.issueEdit', {
          sticky: true,
          page_title: 'Edit Issue',
          ncyBreadcrumb: {
            label: 'Edit Issue',
            parent: 'app.issue'
          },
          url: '/issue/edit/:id',
          permission: ['user', 'admin', 'Approver'],
          views: {
            'main': {
              templateUrl: "issue/templates/edit.html",
              controller: 'IssueEditController',
              controllerAs: 'vm',
              resolve: {
                languages: [
                  '$q',
                  '$translate',
                  preLoadLanguages
                ],
                issueModel: [
                  '$q',
                  '$stateParams',
                  'issueFactory',
                  getIssueModel
                ],
                dataArea: [
                  '$q',
                  'commonFactory',
                  getCommonArea
                ],
                dataLine: [
                  '$q',
                  '$stateParams',
                  'issueFactory',
                  'commonFactory',
                  getCommonLine
                ],
                dataMachine: [
                  '$q',
                  '$stateParams',
                  'issueFactory',
                  'commonFactory',
                  getCommonMachine
                ],
                dataComponent: [
                  '$q',
                  '$stateParams',
                  'issueFactory',
                  'commonFactory',
                  getCommonComponent
                ],
                user: [
                  '$q',
                  'accountFactory',
                  getUserInfo
                ]
              }
            }
          }
        })
        .state('app.issueDetails', {
          sticky: true,
          page_title: 'Issue Details',
          ncyBreadcrumb: {
            label: 'Issue Details',
            parent: 'app.issue'
          },
          url: '/issue/details/:id',
          permission: ['user', 'admin', 'Approver'],
          views: {
            'main': {
              templateUrl: "issue/templates/details.html",
              controller: 'IssueDetailsController',
              controllerAs: 'vm',
              resolve: {
                languages: [
                  '$q',
                  '$translate',
                  preLoadLanguages
                ],
                data: [
                  '$q',
                  '$stateParams',
                  'issueFactory',
                  getIssueModel
                ]
              }
            }
          }
        })
        .state('app.issueTroubleshootDetails', {
          sticky: true,
          page_title: 'Troubleshoot Details',
          ncyBreadcrumb: {
            label: 'Troubleshoot Details',
            parent: 'app.issueDetails'
          },
          url: '/issue/:id/troubleshoot/:troubleId',
          permission: ['user', 'admin', 'Approver'],
          views: {
            'main': {
              templateUrl: "troubleshoot/templates/details.html",
              controller: 'TroubleshootDetailsController',
              controllerAs: 'vm',
              resolve: {
                languages: [
                  '$q',
                  '$translate',
                  preLoadLanguages
                ],
                troubleshootModel: [
                  '$q',
                  '$stateParams',
                  'troubleshootFactory',
                  getTroubleshootModel
                ]
              }
            }
          }
        });
    }
  ]);

  return module.name;
});
