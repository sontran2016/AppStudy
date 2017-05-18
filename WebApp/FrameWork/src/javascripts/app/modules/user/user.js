define(function (require) {
  'use strict';
  var angular = require('angular'),

    userListController = require('./controllers/list'),
    userAddController = require('./controllers/add'),
    userEditController = require('./controllers/edit'),
    selectAreaController = require('./controllers/modal/selectArea'),
    selectLineController = require('./controllers/modal/selectLine'),
    selectMachineController = require('./controllers/modal/selectMachine'),

    listTpl = require('text!./templates/list.html'),
    addTpl = require('text!./templates/add.html'),
    editTpl = require('text!./templates/edit.html'),
    selectAreaTpl = require('text!./templates/modal/selectArea.html'),
    selectLineTpl = require('text!./templates/modal/selectLine.html'),
    selectMachineTpl = require('text!./templates/modal/selectMachine.html');

  var module = angular.module('app.user', []);

  module.config([
    '$translatePartialLoaderProvider',
    function ($translatePartialLoaderProvider) {
      // Language
      $translatePartialLoaderProvider.addPart('javascripts/app/modules/user');
    }]);

  /**
   * Pre load language for site
   * @param $q
   * @param $translate
   * @returns {*}
   */
  function preLoadLanguages($q, $translate) {
    var deferred = $q.defer();
    $translate('USER.HEADING').then(function (translation) {
      deferred.resolve();
    });
    return deferred.promise;
  }

  /**
   * Get User model
   * @param $q
   * @param $stateParams
   * @param userFactory
   * @returns {*}
   */
  function getUserModel($q,
                        $stateParams,
                        userFactory) {
    var userId = $stateParams.id;

    var deferred = $q.defer();
    userFactory.getDetails(userId).then(function (resp) {
      var user = resp.data;
      user.id = userId;
      deferred.resolve(user);
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
   * @param commonFactory
   * @returns {*}
   */
  function getCommonLine($q,
                         commonFactory) {

    var deferred = $q.defer();
    commonFactory.getCommonLine().then(function (resp) {
      deferred.resolve(resp.data);
    });
    return deferred.promise;
  }

  /**
   * get list common machines
   * @param $q
   * @param commonFactory
   * @returns {*}
   */
  function getCommonMachine($q,
                         commonFactory) {

    var deferred = $q.defer();
    commonFactory.getCommonMachine().then(function (resp) {
      deferred.resolve(resp.data);
    });
    return deferred.promise;
  }

  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('user/templates/list.html', listTpl);
      $templateCache.put('user/templates/add.html', addTpl);
      $templateCache.put('user/templates/edit.html', editTpl);
      $templateCache.put('user/templates/modal/selectArea.html', selectAreaTpl);
      $templateCache.put('user/templates/modal/selectLine.html', selectLineTpl);
      $templateCache.put('user/templates/modal/selectMachine.html', selectMachineTpl);
    }]);

  module.controller('UserListController', userListController);
  module.controller('UserAddController', userAddController);
  module.controller('UserEditController', userEditController);
  module.controller('SelectAreaController', selectAreaController);
  module.controller('SelectLineController', selectLineController);
  module.controller('SelectMachineController', selectMachineController);

  module.config([
    '$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('app.user', {
          sticky: true,
          page_title: 'User',
          ncyBreadcrumb: {
            label: 'Users'
          },
          url: '/user',
          permission: ['admin'],
          views: {
            'main': {
              templateUrl: "user/templates/list.html",
              controller: 'UserListController',
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
        .state('app.userAdd', {
          sticky: true,
          page_title: 'New User',
          ncyBreadcrumb: {
            label: 'New User',
            parent: 'app.user'
          },
          url: '/user/add',
          permission: ['admin'],
          views: {
            'main': {
              templateUrl: "user/templates/add.html",
              controller: 'UserAddController',
              controllerAs: 'vm',
              resolve: {
                languages: [
                  '$q',
                  '$translate',
                  preLoadLanguages
                ],
                area: [
                  '$q',
                  'commonFactory',
                  getCommonArea
                ],
                line: [
                  '$q',
                  'commonFactory',
                  getCommonLine
                ],
                machine: [
                  '$q',
                  'commonFactory',
                  getCommonMachine
                ]
              }
            }
          }
        })
        .state('app.userEdit', {
          sticky: true,
          page_title: 'Edit User',
          ncyBreadcrumb: {
            label: 'Edit User',
            parent: 'app.user'
          },
          url: '/user/edit/:id',
          permission: ['admin'],
          views: {
            'main': {
              templateUrl: "user/templates/edit.html",
              controller: 'UserEditController',
              controllerAs: 'vm',
              resolve: {
                languages: [
                  '$q',
                  '$translate',
                  preLoadLanguages
                ],
                userModel: [
                  '$q',
                  '$stateParams',
                  'userFactory',
                  getUserModel
                ],
                area: [
                  '$q',
                  'commonFactory',
                  getCommonArea
                ],
                line: [
                  '$q',
                  'commonFactory',
                  getCommonLine
                ],
                machine: [
                  '$q',
                  'commonFactory',
                  getCommonMachine
                ]
              }
            }
          }
        });
    }
  ]);

  return module.name;
});
