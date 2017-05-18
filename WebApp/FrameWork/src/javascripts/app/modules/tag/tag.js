define(function (require) {
  'use strict';
  var angular = require('angular'),

    tagListController = require('./controllers/list'),
    tagAddController = require('./controllers/add'),
    tagEditController = require('./controllers/edit'),

    listTpl = require('text!./templates/list.html'),
    addTpl = require('text!./templates/add.html'),
    editTpl = require('text!./templates/edit.html');
  var module = angular.module('app.tag', []);

  module.config([
    '$translatePartialLoaderProvider',
    function ($translatePartialLoaderProvider) {
      // Language
      $translatePartialLoaderProvider.addPart('javascripts/app/modules/tag');
    }]);

  /**
   * Pre load language for site
   * @param $q
   * @param $translate
   * @returns {*}
   */
  function preLoadLanguages($q, $translate) {
    var deferred = $q.defer();
    $translate('TAG.HEADING').then(function (translation) {
      deferred.resolve();
    });
    return deferred.promise;
  }

  /**
   * get tag model
   * @param $q
   * @param $stateParams
   * @param tagFactory
   * @returns {*}
   */
  function getTagModel($q,
                       $stateParams,
                       tagFactory) {
    var tagId = $stateParams.id;

    var deferred = $q.defer();
    tagFactory.getDetails(tagId).then(function (resp) {
      deferred.resolve(resp.data);
    });
    return deferred.promise;
  }

  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('tag/templates/list.html', listTpl);
      $templateCache.put('tag/templates/add.html', addTpl);
      $templateCache.put('tag/templates/edit.html', editTpl);
    }]);

  module.controller('TagListController', tagListController);
  module.controller('TagAddController', tagAddController);
  module.controller('TagEditController', tagEditController);

  module.config([
    '$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('app.tag', {
          sticky: true,
          page_title: 'Tag',
          ncyBreadcrumb: {
            label: 'Tags'
          },
          url: '/tag',
          permission: ['admin'],
          views: {
            'main': {
              templateUrl: "tag/templates/list.html",
              controller: 'TagListController',
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

        .state('app.tagAdd', {
          sticky: true,
          page_title: 'New Tag',
          ncyBreadcrumb: {
            label: 'New Tag',
            parent: 'app.tag'
          },
          url: '/tag/add',
          permission: ['admin'],
          views: {
            'main': {
              templateUrl: "tag/templates/add.html",
              controller: 'TagAddController',
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
        }).state('app.tagEdit', {
        sticky: true,
        page_title: 'Edit Tag',
        ncyBreadcrumb: {
          label: 'Edit Tag',
          parent: 'app.tag'
        },
        url: '/tag/edit/:id',
        permission: ['admin'],
        views: {
          'main': {
            templateUrl: "tag/templates/edit.html",
            controller: 'TagEditController',
            controllerAs: 'vm',
            resolve: {
              languages: [
                '$q',
                '$translate',
                preLoadLanguages
              ],
              tagModel: [
                '$q',
                '$stateParams',
                'tagFactory',
                getTagModel
              ]
            }
          }
        }
      });
    }
  ]);

  return module.name;
});
