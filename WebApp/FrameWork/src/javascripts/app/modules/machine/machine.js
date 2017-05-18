define(function (require) {
  'use strict';
  var angular = require('angular'),

    machineListController = require('./controllers/list'),
    machineAddController = require('./controllers/add'),
    machineEditController = require('./controllers/edit'),

    listTpl = require('text!./templates/list.html'),
    addTpl = require('text!./templates/add.html'),
    editTpl = require('text!./templates/edit.html');

  var module = angular.module('app.machine', []);

  module.config([
    '$translatePartialLoaderProvider',
    function ($translatePartialLoaderProvider) {
      // Language
      $translatePartialLoaderProvider.addPart('javascripts/app/modules/machine');
    }]);

  /**
   * Pre load language for site
   * @param $q
   * @param $translate
   * @returns {*}
   */
  function preLoadLanguages($q, $translate) {
    var deferred = $q.defer();
    $translate('MACHINE.HEADING').then(function (translation) {
      deferred.resolve();
    });
    return deferred.promise;
  }

  /**
   * getMachineModel
   * @param $q
   * @param $stateParams
   * @param machineFactory
   * @returns {*}
   */
  function getMachineModel($q, $stateParams, machineFactory) {
    var machineId = $stateParams.id;

    var deferred = $q.defer();
    machineFactory.getDetails(machineId).then(function (resp) {
      var machine = resp.data;
      deferred.resolve(machine);
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

  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('machine/templates/list.html', listTpl);
      $templateCache.put('machine/templates/add.html', addTpl);
      $templateCache.put('machine/templates/edit.html', editTpl);
    }]);

  module.controller('MachineListController', machineListController);
  module.controller('MachineAddController', machineAddController);
  module.controller('MachineEditController', machineEditController);

  module.config([
    '$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('app.machine', {
          sticky: true,
          page_title: 'Machine',
          ncyBreadcrumb: {
            label: 'Machines'
          },
          url: '/machine',
          permission: ['admin'],
          views: {
            'main': {
              templateUrl: "machine/templates/list.html",
              controller: 'MachineListController',
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
        .state('app.machineAdd', {
          sticky: true,
          page_title: 'New Machine',
          ncyBreadcrumb: {
            label: 'New Machine',
            parent: 'app.machine'
          },
          url: '/machine/add',
          permission: ['admin'],
          views: {
            'main': {
              templateUrl: "machine/templates/add.html",
              controller: 'MachineAddController',
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
                  getCommonLine
                ]
              }
            }
          }
        })
        .state('app.machineEdit', {
          sticky: true,
          page_title: 'Edit Machine',
          ncyBreadcrumb: {
            label: 'Edit Machine',
            parent: 'app.machine'
          },
          url: '/machine/edit/:id',
          permission: ['admin'],
          views: {
            'main': {
              templateUrl: "machine/templates/edit.html",
              controller: 'MachineEditController',
              controllerAs: 'vm',
              resolve: {
                languages: [
                  '$q',
                  '$translate',
                  preLoadLanguages
                ],
                machineModel: [
                  '$q',
                  '$stateParams',
                  'machineFactory',
                  getMachineModel
                ],
                data: [
                  '$q',
                  'commonFactory',
                  getCommonLine
                ]
              }
            }
          }
        });
    }
  ]);

  return module.name;
});
