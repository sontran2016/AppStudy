define(function(require) {
  'use strict';
  var angular = require('angular'),
    module;
  module = angular.module('common.directives.stopLoader', []);
  module.directive('stopLoader', [
    '$timeout',
    '$rootScope',
    function($timeout,
             $rootScope) {

      /**
       * Stop preloader to target element
       * @param scope
       * @param element
       */
      function autoFocusLinkFn(scope, element) {
        element.addClass('loaded');
        $timeout(function() {
          element.find('#loader-wrapper').remove();
          $rootScope.pageLoaded = true;
        }, 1000);
      }

      return {
        restrict: 'A',
        link: autoFocusLinkFn
      };
    }]);
  return module.name;
});
