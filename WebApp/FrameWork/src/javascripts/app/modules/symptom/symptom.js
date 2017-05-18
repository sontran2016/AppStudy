define(function (require) {
  'use strict';
  var angular = require('angular'),

    symptomListController = require('./controllers/list'),
    symptomAddController = require('./controllers/add'),
    symptomEditController = require('./controllers/edit'),

    listTpl = require('text!./templates/list.html'),
    addTpl = require('text!./templates/add.html'),
    editTpl = require('text!./templates/edit.html');
  var module = angular.module('app.symptom', []);

  module.config([
    '$translatePartialLoaderProvider',
    function ($translatePartialLoaderProvider) {
      // Language
      $translatePartialLoaderProvider.addPart('javascripts/app/modules/symptom');
    }]);

  /**
   * Pre load language for site
   * @param $q
   * @param $translate
   * @returns {*}
   */
  function preLoadLanguages($q, $translate) {
    var deferred = $q.defer();
    $translate('SYMPTOM.HEADING').then(function (translation) {
      deferred.resolve();
    });
    return deferred.promise;
  }

  /**
   * get symptom model
   * @param $q
   * @param $stateParams
   * @param symptomFactory
   * @returns {*}
   */
  function getSymptomModel($q,
                           $stateParams,
                           symptomFactory) {
    var symptomId = $stateParams.id;

    var deferred = $q.defer();
    symptomFactory.getDetails(symptomId).then(function (resp) {
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
      $templateCache.put('symptom/templates/list.html', listTpl);
      $templateCache.put('symptom/templates/add.html', addTpl);
      $templateCache.put('symptom/templates/edit.html', editTpl);
    }]);

  module.controller('SymptomListController', symptomListController);
  module.controller('SymptomAddController', symptomAddController);
  module.controller('SymptomEditController', symptomEditController);

  module.config([
    '$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('app.symptom', {
          sticky: true,
          page_title: 'Symptoms',
          ncyBreadcrumb: {
            label: 'Symptoms'
          },
          url: '/symptom',
          permission: ['admin'],
          views: {
            'main': {
              templateUrl: "symptom/templates/list.html",
              controller: 'SymptomListController',
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

        .state('app.symptomEdit', {
          sticky: true,
          page_title: 'Edit Symptom',
          ncyBreadcrumb: {
            label: 'Edit Symptom',
            parent: 'app.symptom'
          },
          url: '/symptom/edit/:id',
          permission: ['admin'],
          views: {
            'main': {
              templateUrl: "symptom/templates/edit.html",
              controller: 'SymptomEditController',
              controllerAs: 'vm',
              resolve: {
                languages: [
                  '$q',
                  '$translate',
                  preLoadLanguages
                ],
                symptomModel: [
                  '$q',
                  '$stateParams',
                  'symptomFactory',
                  getSymptomModel
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
