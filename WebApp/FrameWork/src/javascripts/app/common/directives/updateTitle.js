define(function (require) {
  'use strict';
  var angular = require('angular'),
    module;
  module = angular.module('common.directives.updateTitle', []);
  module.directive('updateTitle', [
    '$rootScope',
    function ($rootScope) {
      return {
        restrict: 'A',

        /**
         * link fn
         * @param scope
         * @param element
         */
        link: function (scope, element) {
          /**
           * listener fn
           * @param event
           * @param toState
           * @param toParams
           * @param fromState
           * @param fromParams
           */
          var listener = function (event, toState, toParams, fromState, fromParams) {
            var title = 'E-Troubleshooting';
            if (toState.page_title) {
              title = toState.page_title;
            }
            if ($rootScope.appVer) {
              element.text(title + ' (' + $rootScope.appVer + ')');
            } else {
              element.text(title);
            }
          };
          $rootScope.$on('$stateChangeSuccess', listener);
        }
      };
    }]);
  return module.name;
});
