define(function(require) {
  'use strict';
  var angular = require('angular'),
    tpl = require('text!./templates/ajaxLoading.html');

  var module = angular.module('common.directives.ajaxLoading', []);

  module.run([
    '$templateCache',
    function($templateCache) {
      $templateCache.put('ajaxLoadingTemplate', tpl);
    }]);

  module.factory('ajaxLoadingFactory', [
    '$rootScope',
    function($rootScope) {
      var services = {};

      services.nextRequestLoader = true;

      /**
       * show function
       */
      services.show = function() {
        $rootScope.$broadcast('ajaxLoading.show');
      };

      /**
       * hide function
       */
      services.hide = function() {
        $rootScope.$broadcast('ajaxLoading.hide');
      };

      /**
       * hide next request loader
       */
      services.hideNextRequestLoader = function() {
        services.nextRequestLoader = false;
      };

      /**
       * set next request loader options
       * @param options
       */
      services.nextRequestLoaderOptions = function(options) {
        services.nextRequestLoader = options.nextRequestLoader;
      };

      return services;
    }]);

  module.directive('ajaxLoading', [
    '$timeout',
    'ajaxLoadingFactory',
    function($timeout,
             ajaxLoadingFactory) {
      return {
        restrict: 'E',
        templateUrl: 'ajaxLoadingTemplate',
        /**
         * link function
         * @param scope
         * @param elem
         * @param attrs
         */
        link: function(scope, elem, attrs) {
          var $element = elem.children('.overlay-layer'), timer, count = 0;

          /**
           * show loading
           */
          function showLoading() {
            if($element[0]) {
              if(timer) {
                $timeout.cancel(timer);
              }

              // Show element
              $element.addClass('active');

              // Animation
              $element.addClass('in');
              $element.removeClass('out');
            }
          }

          /**
           * hide loading
           */
          function hideLoading() {
            if($element[0]) {
              // Animation
              $element.addClass('out');
              $element.removeClass('in');

              timer = $timeout(function() {
                $element.removeClass('active');
              }, 500);
            }
          }


          scope.$on('ajaxLoading.show', function() {
            showLoading();
          });

          scope.$on('ajaxLoading.hide', function() {
            hideLoading();
          });

          scope.$on('cfpLoadingBar:loading', function() {
            if(ajaxLoadingFactory.nextRequestLoader) {
              count++;
              showLoading();
            }
            ajaxLoadingFactory.nextRequestLoaderOptions({
              nextRequestLoader: true
            });
          });

          scope.$on('cfpLoadingBar:loaded', function() {
            count--;
            if(count <= 0) {
              count = 0;
              hideLoading();
            }
          });
        }
      };
    }]);
  return module.name;
});
