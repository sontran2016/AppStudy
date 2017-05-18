define(function (require) {
  'use strict';
  var angular = require('angular'),
    treeViewController = require('./controllers/treeView'),
    treeViewTpl = require('text!./templates/treeView.html');

  var module = angular.module('app.treeView', []);

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
   * get user info
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
      $templateCache.put('treeView/templates/treeView.html', treeViewTpl);
    }]);

  module.controller('TreeViewController', treeViewController);

  module.config([
    '$translatePartialLoaderProvider',
    function ($translatePartialLoaderProvider) {
      // Language
      $translatePartialLoaderProvider.addPart('javascripts/app/modules/treeView');
    }]);

  module.config(
    ['$stateProvider',
      function ($stateProvider) {
        $stateProvider
          .state('app.treeView', {
            page_title: 'Tree View Page',
            ncyBreadcrumb: {
              label: 'Tree View'
            },
            url: '/treeView',
            permission: ['user', 'admin', 'Approver'],
            views: {
              'main': {
                templateUrl: "treeView/templates/treeView.html",
                controller: 'TreeViewController',
                controllerAs: 'vm',
                resolve: {
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
          });
          
      }
    ]
  );

  return module.name;
});
