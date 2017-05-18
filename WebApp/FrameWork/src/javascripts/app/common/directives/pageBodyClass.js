define(function(require) {
  'use strict';
  var angular = require('angular'),
    _ = require('lodash'),
    module;
  module = angular.module('common.directives.pageBodyClass', []);
  module.directive('pageBodyClass', [
    '$rootScope',
    function($rootScope) {
      return {
        restrict: 'A',

        /**
         * link fn
         * @param scope
         * @param elem
         * @param attrs
         */
        link: function(scope, elem, attrs) {
          $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams) {
              //// Remove previous classes
              //_.each((elem.attr('custom-class') || '').split(' '), function(cl) {
              //  elem.removeClass(cl);
              //});
              //attrs.$set('custom-class', (toState.classes || []).join(' '));
            });

          $rootScope.$on('$stateChangeSuccess',
            function(event, toState, toParams, fromState, fromParams) {

              // Remove previous classes
              _.each((elem.attr('custom-class') || '').split(' '), function(cl) {
                elem.removeClass(cl);
              });
              attrs.$set('custom-class', (toState.classes || []).join(' '));

              // Add custom class
              var classes = elem.attr('custom-class');
              _.each(classes.split(' '), function(cl) {
                elem.addClass(cl);
              });
            });
        }
      };
    }]);
  return module.name;
});
