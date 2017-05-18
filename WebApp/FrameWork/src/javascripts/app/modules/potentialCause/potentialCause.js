define(function (require) {
  'use strict';
  var angular = require('angular'),

    potentialCauseListController = require('./controllers/list'),
    potentialCauseAddController = require('./controllers/add'),
    potentialCauseEditController = require('./controllers/edit'),

    listTpl = require('text!./templates/list.html'),
    addTpl = require('text!./templates/add.html'),
    editTpl = require('text!./templates/edit.html');
  var module = angular.module('app.potentialCause', []);

  module.config([
    '$translatePartialLoaderProvider',
    function ($translatePartialLoaderProvider) {
      // Language
      $translatePartialLoaderProvider.addPart('javascripts/app/modules/potentialCause');
    }]);

  /**
   * Pre load language for site
   * @param $q
   * @param $translate
   * @returns {*}
   */
  function preLoadLanguages($q, $translate) {
    var deferred = $q.defer();
    $translate('POTENTIAL_CAUSE.HEADING').then(function (translation) {
      deferred.resolve();
    });
    return deferred.promise;
  }

  /**
   * get potential cause model
   * @param $q
   * @param $stateParams
   * @param potentialCauseFactory
   * @returns {*}
   */
  function getPotentialCauseModel($q,
                                  $stateParams,
                                  potentialCauseFactory) {
    var potentialCauseId = $stateParams.id;

    var deferred = $q.defer();
    potentialCauseFactory.getDetails(potentialCauseId).then(function (resp) {
      deferred.resolve(resp.data);
    });
    return deferred.promise;
  }

  /**
   * get issue list
   * @param $q
   * @param commonFactory
   * @returns {*}
   */
  function getIssueList($q,
                        commonFactory) {
    var deferred = $q.defer();
    commonFactory.getIssueList().then(function (resp) {
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
      $templateCache.put('potentialCause/templates/list.html', listTpl);
      $templateCache.put('potentialCause/templates/add.html', addTpl);
      $templateCache.put('potentialCause/templates/edit.html', editTpl);
    }]);

  module.controller('PotentialCauseListController', potentialCauseListController);
  module.controller('PotentialCauseAddController', potentialCauseAddController);
  module.controller('PotentialCauseEditController', potentialCauseEditController);

  module.config([
    '$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('app.potentialCause', {
          sticky: true,
          page_title: 'Potential Cause',
          ncyBreadcrumb: {
            label: 'Potential Causes'
          },
          url: '/potentialCause',
          permission: ['admin'],
          views: {
            'main': {
              templateUrl: "potentialCause/templates/list.html",
              controller: 'PotentialCauseListController',
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

      .state('app.potentialCauseEdit', {
        sticky: true,
        page_title: 'Edit Potential Cause',
        ncyBreadcrumb: {
          label: 'Edit Potential Cause',
          parent: 'app.potentialCause'
        },
        url: '/potentialCause/edit/:id',
        permission: ['admin'],
        views: {
          'main': {
            templateUrl: "potentialCause/templates/edit.html",
            controller: 'PotentialCauseEditController',
            controllerAs: 'vm',
            resolve: {
              languages: [
                '$q',
                '$translate',
                preLoadLanguages
              ],
              potentialCauseModel: [
                '$q',
                '$stateParams',
                'potentialCauseFactory',
                getPotentialCauseModel
              ],
              issueList: [
                '$q',
                'commonFactory',
                getIssueList
              ]
            }
          }
        }
      });
    }
  ]);

  return module.name;
});
