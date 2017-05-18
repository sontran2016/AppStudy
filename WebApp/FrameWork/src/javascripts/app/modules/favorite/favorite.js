define(function (require) {
  'use strict';
  var angular = require('angular'),
    controller = require('./controllers/favorite'),
    template = require('text!./templates/favorite.html');

  var module = angular.module('app.favorite', []);

  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('favorite/templates/favorite.html', template);
    }]);

  module.controller('FavoriteController', controller);

  module.config([
    '$translatePartialLoaderProvider',
    function ($translatePartialLoaderProvider) {
      // Language
      $translatePartialLoaderProvider.addPart('javascripts/app/modules/favorite');
    }]);

  /**
   * Pre load language for site
   * @param $q
   * @param $translate
   * @returns {*}
   */
  function preLoadLanguages($q, $translate) {
    var deferred = $q.defer();
    $translate('FAVORITE.HEADING').then(function (translation) {
      deferred.resolve();
    });
    return deferred.promise;
  }

  module.config(
    ['$stateProvider',
      function ($stateProvider) {
        $stateProvider
          .state('app.favorite', {
            page_title: 'My Favorite Troubleshoots',
            ncyBreadcrumb: {
              label: 'My Favorite Troubleshoots'
            },
            url: '/favorite',
            permission: ['user', 'admin', 'Approver'],
            views: {
              'main': {
                templateUrl: "favorite/templates/favorite.html",
                controller: 'FavoriteController',
                controllerAs: 'vm',
                resolve: {
                  
                }
              }
            },
            resolve: {
              languages: [
                  '$q',
                  '$translate',
                  preLoadLanguages
                ],
              favoriteData: [
                  '$q',
                  'troubleshootFactory',
                  function ($q,
                            troubleshootFactory) {
                    var deferred = $q.defer();

                    troubleshootFactory.getListFavoriteTroubles().then(function (resp) {
                      deferred.resolve(resp.data.troubles);
                    }, function () {
                      deferred.reject();
                    });
                    return deferred.promise;
                  }]
            }
          });
          
      }
    ]
  );

  return module.name;
});
