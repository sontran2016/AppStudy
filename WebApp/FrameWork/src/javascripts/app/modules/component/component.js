define(function (require) {
  'use strict';
  var angular = require('angular'),

    componentListController = require('./controllers/list'),
    componentAddController = require('./controllers/add'),
    componentEditController = require('./controllers/edit'),

    listTpl = require('text!./templates/list.html'),
    addTpl = require('text!./templates/add.html'),
    editTpl = require('text!./templates/edit.html');

  var module = angular.module('app.component', []);

  module.config([
    '$translatePartialLoaderProvider',
    function ($translatePartialLoaderProvider) {
      // Language
      $translatePartialLoaderProvider.addPart('javascripts/app/modules/component');
    }]);

  /**
   * Pre load language for site
   * @param $q
   * @param $translate
   * @returns {*}
   */
  function preLoadLanguages($q, $translate) {
    var deferred = $q.defer();
    $translate('COMPONENT.HEADING').then(function (translation) {
      deferred.resolve();
    });
    return deferred.promise;
  }

  /**
   * getComponentModel
   * @param $q
   * @param $stateParams
   * @param componentFactory
   * @returns {*}
   */
  function getComponentModel($q, $stateParams, componentFactory) {
    var componentId = $stateParams.id;

    var deferred = $q.defer();
    componentFactory.getDetails(componentId).then(function (resp) {
      var component = resp.data;
      deferred.resolve(component);
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
   * get list common machines for add component
   * @param $q
   * @param commonFactory
   * @returns {*}
   */
  function getCommonMachineForAdd($q,
                                  commonFactory) {

    var deferred = $q.defer();
    commonFactory.getCommonMachine().then(function (resp) {
      deferred.resolve(resp.data);
    });
    return deferred.promise;
  }

  /**
   * get list common machines for edit component
   * @param $q
   * @param commonFactory
   * @returns {*}
   */
  function getCommonMachine($q,
                          $stateParams,
                          componentFactory,
                          commonFactory) {

    var deferred = $q.defer();
    var componentId = $stateParams.id;
    componentFactory.getDetails(componentId).then(function (componentResp) {
      var param = {
        lineId: _.map(componentResp.data.lines, 'id').join()
      };
      commonFactory.getCommonMachine(param).then(function (resp) {
        deferred.resolve(resp.data);
      });
    });
    return deferred.promise;
  }

  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('component/templates/list.html', listTpl);
      $templateCache.put('component/templates/add.html', addTpl);
      $templateCache.put('component/templates/edit.html', editTpl);
    }]);

  module.controller('ComponentListController', componentListController);
  module.controller('ComponentAddController', componentAddController);
  module.controller('ComponentEditController', componentEditController);

  module.config([
    '$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('app.component', {
          sticky: true,
          page_title: 'Component',
          ncyBreadcrumb: {
            label: 'Components'
          },
          url: '/component',
          permission: ['admin'],
          views: {
            'main': {
              templateUrl: "component/templates/list.html",
              controller: 'ComponentListController',
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
        .state('app.componentAdd', {
          sticky: true,
          page_title: 'New Component',
          ncyBreadcrumb: {
            label: 'New Component',
            parent: 'app.component'
          },
          url: '/component/add',
          permission: ['admin'],
          views: {
            'main': {
              templateUrl: "component/templates/add.html",
              controller: 'ComponentAddController',
              controllerAs: 'vm',
              resolve: {
                languages: [
                  '$q',
                  '$translate',
                  preLoadLanguages
                ],
                dataLine: [
                  '$q',
                  'commonFactory',
                  getCommonLine
                ],
                dataMachine: [
                  '$q',
                  'commonFactory',
                  getCommonMachineForAdd
                ]
              }
            }
          }
        })
        .state('app.componentEdit', {
          sticky: true,
          page_title: 'Edit Component',
          ncyBreadcrumb: {
            label: 'Edit Component',
            parent: 'app.component'
          },
          url: '/component/edit/:id',
          permission: ['admin'],
          views: {
            'main': {
              templateUrl: "component/templates/edit.html",
              controller: 'ComponentEditController',
              controllerAs: 'vm',
              resolve: {
                languages: [
                  '$q',
                  '$translate',
                  preLoadLanguages
                ],
                componentModel: [
                  '$q',
                  '$stateParams',
                  'componentFactory',
                  getComponentModel
                ],
                dataLine: [
                  '$q',
                  'commonFactory',
                  getCommonLine
                ],
                dataMachine: [
                  '$q',
                  '$stateParams',
                  'componentFactory',
                  'commonFactory',
                  getCommonMachine
                ],
              }
            }
          }
        });
    }
  ]);

  return module.name;
});
