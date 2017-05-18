define(function (require) {
  'use strict';
  var angular = require('angular'),
    controller = require('./controllers/profile'),
    template = require('text!./templates/profile.html');

  var module = angular.module('app.profile', []);

  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('profile/templates/profile.html', template);
    }]);

  /**
   * Pre load language for site
   * @param $q
   * @param $translate
   * @returns {*}
   */
  function preLoadLanguages($q, $translate) {
    var deferred = $q.defer();
    $translate('PROFILE.HEADING').then(function (translation) {
      deferred.resolve();
    });
    return deferred.promise;
  }

  // controllers
  module.controller('ProfileController', controller);

  module.config([
    '$stateProvider',
    '$translatePartialLoaderProvider',
    function ($stateProvider,
              $translatePartialLoaderProvider) {

      // Language
      $translatePartialLoaderProvider.addPart('javascripts/app/modules/profile');

      $stateProvider
        .$state('app.profile', {
          page_title: 'Profile page',
          ncyBreadcrumb: {
            label: 'Profile'
          },
          url: '/profile',
          permission: ['user', 'admin', 'Approver'],
          views: {
            'main': {
              templateUrl: "profile/templates/profile.html",
              controller: 'ProfileController',
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
        });
    }]);

  return module.name;
});
