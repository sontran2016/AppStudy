define(function (require) {
  'use strict';
  var angular = require('angular'),

    lineListController = require('./controllers/list'),
    lineAddController = require('./controllers/add'),
    lineEditController = require('./controllers/edit'),

    listTpl = require('text!./templates/list.html'),
    addTpl = require('text!./templates/add.html'),
    editTpl = require('text!./templates/edit.html');

  var module = angular.module('app.line', []);

  module.config([
    '$translatePartialLoaderProvider',
    function ($translatePartialLoaderProvider) {
      // Language
      $translatePartialLoaderProvider.addPart('javascripts/app/modules/line');
    }]);

  /**
   * Pre load language for site
   * @param $q
   * @param $translate
   * @returns {*}
   */
  function preLoadLanguages($q, $translate) {
    var deferred = $q.defer();
    $translate('LINE.HEADING').then(function (translation) {
      deferred.resolve();
    });
    return deferred.promise;
  }

  /**
   * getLineModel
   * @param $q
   * @param $stateParams
   * @param lineFactory
   * @returns {*}
   */
  function getLineModel($q,
                         $stateParams,
                         lineFactory) {
    
    var lineId = $stateParams.id;
    var deferred = $q.defer();
    lineFactory.getDetails(lineId).then(function (resp) {
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

  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('line/templates/list.html', listTpl);
      $templateCache.put('line/templates/add.html', addTpl);
      $templateCache.put('line/templates/edit.html', editTpl);
    }]);

  module.controller('LineListController', lineListController);
  module.controller('LineAddController', lineAddController);
  module.controller('LineEditController', lineEditController);

  module.config([
    '$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('app.line', {
          sticky: true,
          page_title: 'Lines',
          ncyBreadcrumb: {
            label: 'Lines'
          },
          url: '/line',
          permission: ['admin'],
          views: {
            'main': {
              templateUrl: "line/templates/list.html",
              controller: 'LineListController',
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
        .state('app.lineAdd', {
          sticky: true,
          page_title: 'New Line',
          ncyBreadcrumb: {
            label: 'New Line',
            parent: 'app.line'
          },
          url: '/line/add',
          permission: ['admin'],
          views: {
            'main': {
              templateUrl: "line/templates/add.html",
              controller: 'LineAddController',
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
        .state('app.lineEdit', {
          sticky: true,
          page_title: 'Edit Line',
          ncyBreadcrumb: {
            label: 'Edit Line',
            parent: 'app.line'
          },
          url: '/line/edit/:id',
          permission: ['admin'],
          views: {
            'main': {
              templateUrl: "line/templates/edit.html",
              controller: 'LineEditController',
              controllerAs: 'vm',
              resolve: {
                languages: [
                  '$q',
                  '$translate',
                  preLoadLanguages
                ],
                lineModel: [
                  '$q',
                  '$stateParams',
                  'lineFactory',
                  getLineModel
                ],
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
  ]);

  return module.name;
});
