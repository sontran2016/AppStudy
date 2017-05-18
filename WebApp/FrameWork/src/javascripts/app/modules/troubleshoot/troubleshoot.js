define(function (require) {
  'use strict';
  var angular = require('angular'),

    troubleshootListController = require('./controllers/list'),
    troubleshootAddController = require('./controllers/add'),
    troubleshootEditController = require('./controllers/edit'),
    troubleshootDetailsController = require('./controllers/details'),
    newShootingController = require('./controllers/modal/newShooting'),
    myShootingController = require('./controllers/modal/myShooting'),
    rejectShootingController = require('./controllers/modal/rejectShooting'),
    notifyChangedTroubleshootController = require('./controllers/modal/notifyChangedTroubleshoot'),

    listTpl = require('text!./templates/list.html'),
    addTpl = require('text!./templates/add.html'),
    editTpl = require('text!./templates/edit.html'),
    detailsTpl = require('text!./templates/details.html'),
    newShootingTpl = require('text!./templates/modal/newShooting.html'),
    myShootingTpl = require('text!./templates/modal/myShooting.html'),
    rejectShootingTpl = require('text!./templates/modal/rejectShooting.html'),
    notifyChangedTpl = require('text!./../../common/templates/notifyChanged.html');

  var module = angular.module('app.troubleshoot', []);

  module.config([
    '$translatePartialLoaderProvider',
    function ($translatePartialLoaderProvider) {
      // Language
      $translatePartialLoaderProvider.addPart('javascripts/app/modules/troubleshoot');
    }]);

  /**
   * Pre load language for site
   * @param $q
   * @param $translate
   * @returns {*}
   */
  function preLoadLanguages($q, $translate) {
    var deferred = $q.defer();
    $translate('TROUBLESHOOT.HEADING').then(function (translation) {
      deferred.resolve();
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
    var troubleshootId = $stateParams.id;
    var deferred = $q.defer();

    troubleshootFactory.getDetails(troubleshootId).then(function (resp) {
      deferred.resolve(resp.data);
    });
    return deferred.promise;
  }

    /**
   * Get issue
   * @param $q
   * @param $stateParams
   * @param issueFactory
   * @returns {*}
   */
  function getIssueModel($q,
                                $stateParams,
                                issueFactory) {
    var issueId = $stateParams.issueId;
    var deferred = $q.defer();

    issueFactory.getDetails(issueId).then(function (resp) {
      deferred.resolve(resp.data);
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

  /**
   * Get tag list
   * @param $q
   * @param tagFactory
   * @returns {*}
   */
  function getTag($q,
                  tagFactory) {
    var deferred = $q.defer();
    tagFactory.getAllTags().then(function (resp) {
      deferred.resolve(resp.data);
    });
    return deferred.promise;
  }

  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('troubleshoot/templates/list.html', listTpl);
      $templateCache.put('troubleshoot/templates/add.html', addTpl);
      $templateCache.put('troubleshoot/templates/edit.html', editTpl);
      $templateCache.put('troubleshoot/templates/details.html', detailsTpl);
      $templateCache.put('troubleshoot/templates/modal/newShooting.html', newShootingTpl);
      $templateCache.put('troubleshoot/templates/modal/myShooting.html', myShootingTpl);
      $templateCache.put('troubleshoot/templates/modal/rejectShooting.html', rejectShootingTpl);
      $templateCache.put('common/templates/notifyChanged.html', notifyChangedTpl);
    }]);

  module.controller('TroubleshootListController', troubleshootListController);
  module.controller('TroubleshootAddController', troubleshootAddController);
  module.controller('TroubleshootEditController', troubleshootEditController);
  module.controller('TroubleshootDetailsController', troubleshootDetailsController);
  module.controller('NewShootingController', newShootingController);
  module.controller('MyShootingController', myShootingController);
  module.controller('RejectShootingController', rejectShootingController);
  module.controller('NotifyChangedTroubleshootController', notifyChangedTroubleshootController);

  module.config([
    '$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('app.troubleshoot', {
          sticky: true,
          page_title: 'Troubleshoot',
          ncyBreadcrumb: {
            label: 'Troubleshoots'
          },
          url: '/troubleshoot',
          permission: ['user', 'admin', 'Approver'],
          views: {
            'main': {
              templateUrl: "troubleshoot/templates/list.html",
              controller: 'TroubleshootListController',
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

        .state('app.troubleshootAdd', {
          sticky: true,
          page_title: 'New Troubleshoot',
          ncyBreadcrumb: {
            label: 'New Troubleshoot',
            parent: 'app.troubleshoot'
          },
          url: '/troubleshoot/add',
          permission: ['user', 'admin', 'Approver'],
          views: {
            'main': {
              templateUrl: "troubleshoot/templates/add.html",
              controller: 'TroubleshootAddController',
              controllerAs: 'vm',
              resolve: {
                languages: [
                  '$q',
                  '$translate',
                  preLoadLanguages
                ],
                tag: [
                  '$q',
                  'tagFactory',
                  getTag
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

        .state('app.troubleshootDetails', {
          sticky: true,
          page_title: 'Trouble Shoot Details',
          ncyBreadcrumb: {
            label: 'Troubleshoot Details',
            parent: 'app.troubleshoot'
          },
          url: '/troubleshoot/details/:id',
          permission: ['user', 'admin', 'Approver'],
          views: {
            'main': {
              templateUrl: "troubleshoot/templates/details.html",
              controller: 'TroubleshootDetailsController',
              controllerAs: 'vm',
              resolve: {
                troubleshootModel: [
                  '$q',
                  '$stateParams',
                  'troubleshootFactory',
                  getTroubleshootModel
                ]
              }
            }
          }
        })

        .state('app.troubleshootEdit', {
          sticky: true,
          page_title: 'Edit Trouble Shoot',
          ncyBreadcrumb: {
            label: 'Edit Troubleshoot',
            parent: 'app.troubleshoot'
          },
          url: '/troubleshoot/edit/:id',
          permission: ['user', 'admin', 'Approver'],
          views: {
            'main': {
              templateUrl: "troubleshoot/templates/edit.html",
              controller: 'TroubleshootEditController',
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
                ],
                tag: [
                  '$q',
                  'tagFactory',
                  getTag
                ],
                user: [
                  '$q',
                  'accountFactory',
                  getUserInfo
                ]
              }
            }
          }
        });
    }
  ]);

  return module.name;
});
