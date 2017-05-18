define(function (require) {
  'use strict';
  var angular = require('angular'),

    areaListController = require('./controllers/list'),
    areaAddController = require('./controllers/add'),
    areaEditController = require('./controllers/edit'),

    listTpl = require('text!./templates/list.html'),
    addTpl = require('text!./templates/add.html'),
    editTpl = require('text!./templates/edit.html');

  var module = angular.module('app.area', []);

  module.config([
    '$translatePartialLoaderProvider',
    function ($translatePartialLoaderProvider) {
      // Language
      $translatePartialLoaderProvider.addPart('javascripts/app/modules/area');
    }]);

  /**
   * Pre load language for site
   * @param $q
   * @param $translate
   * @returns {*}
   */
  function preLoadLanguages($q, $translate) {
    var deferred = $q.defer();
    $translate('AREA.HEADING').then(function (translation) {
      deferred.resolve();
    });
    return deferred.promise;
  }

  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('area/templates/list.html', listTpl);
      $templateCache.put('area/templates/add.html', addTpl);
      $templateCache.put('area/templates/edit.html', editTpl);
    }]);

  module.controller('AreaListController', areaListController);
  module.controller('AreaAddController', areaAddController);
  module.controller('AreaEditController', areaEditController);

  module.config([
    '$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('app.area', {
          sticky: true,
          page_title: 'Area',
          ncyBreadcrumb: {
            label: 'Areas'
          },
          url: '/area',
          permission: ['admin'],
          views: {
            'main': {
              templateUrl: "area/templates/list.html",
              controller: 'AreaListController',
              controllerAs: 'vm',
              resolve: {
                languages: [
                  '$q',
                  '$translate',
                  preLoadLanguages
                ]
              }
            }
          }
        })
        .state('app.areaAdd', {
          sticky: true,
          page_title: 'New Area',
          ncyBreadcrumb: {
            label: 'New Area',
            parent: 'app.area'
          },
          url: '/area/add',
          permission: ['admin'],
          views: {
            'main': {
              templateUrl: "area/templates/add.html",
              controller: 'AreaAddController',
              controllerAs: 'vm',
              resolve: {
                languages: [
                  '$q',
                  '$translate',
                  preLoadLanguages
                ]
              }
            }
          }
        })
        .state('app.areaEdit', {
          sticky: true,
          page_title: 'Edit Area',
          ncyBreadcrumb: {
            label: 'Edit Area',
            parent: 'app.area'
          },
          url: '/area/edit/:id',
          permission: ['admin'],
          views: {
            'main': {
              templateUrl: "area/templates/edit.html",
              controller: 'AreaEditController',
              controllerAs: 'vm',
              resolve: {
                languages: [
                  '$q',
                  '$translate',
                  preLoadLanguages
                ],
                areaModel: [
                  '$q',
                  '$stateParams',
                  'areaFactory',
                  function ($q,
                            $stateParams,
                            areaFactory) {
                    var areaId = $stateParams.id;

                    var deferred = $q.defer();
                    areaFactory.getDetails(areaId).then(function (resp) {
                      var area = resp.data;
                      deferred.resolve(area);
                    });
                    return deferred.promise;
                  }
                ]
              }
            }
          }
        });
    }
  ]);

  return module.name;
});
