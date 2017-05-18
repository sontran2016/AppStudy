define(function (require) {
  'use strict';
  var angular = require('angular'),
    jQuery = require('jquery');
  var directive = [
    '$rootScope',
    '$cookieStore',
    '$window',
    '$timeout',
    '$malihuScroll',
    function ($rootScope,
              $cookieStore,
              $window,
              $timeout,
              $malihuScroll) {
      return {
        restrict: 'E',
        template: '<span class="menu_toggle" ng-click="toggleSidebar()"><span class="icon_menu_toggle" ><i class="arrow_carrot-2left" ng-class="sideNavCollapsed ? \'hide\' : \'\'"></i><i class="arrow_carrot-2right" ng-class="sideNavCollapsed ? \'\' : \'hide\'"></i></span></span>',
        /**
         * link fn
         * @param scope
         * @param el
         * @param attrs
         */
        link: function (scope, el, attrs) {
          var mobileView = 992,
            $scroller = $malihuScroll.get('aside');

          /**
           * get width
           * @returns {number}
           */
          $rootScope.getWidth = function () {
            return window.innerWidth;
          };
          $rootScope.$watch($rootScope.getWidth, function (newValue, oldValue) {
            if (newValue >= mobileView) {

              // Set default collapsed when first load app
              if (angular.isDefined($cookieStore.get('sideNavCollapsed'))) {
                if ($cookieStore.get('sideNavCollapsed') === false) {
                  $rootScope.sideNavCollapsed = false;
                } else {
                  $rootScope.sideNavCollapsed = true;
                }
              } else {
                $rootScope.sideNavCollapsed = true;
              }
            } else {
              $rootScope.sideNavCollapsed = true;
            }
            $timeout(function () {
              jQuery(window).resize();
            });
          });
          /**
           * toggle side bar
           */
          scope.toggleSidebar = function () {
            $rootScope.sideNavCollapsed = !$rootScope.sideNavCollapsed;
            $cookieStore.put('sideNavCollapsed', $rootScope.sideNavCollapsed);
            if (!$rootScope.fixedLayout) {
              if (window.innerWidth > 991) {
                $timeout(function () {
                  jQuery(window).resize();
                });
              }
            }
            if ($scroller) {
              if (!$rootScope.sideNavCollapsed) {
                $scroller.create();
              } else {
                $scroller.destroy();
              }
            }
          };

          $rootScope.sideNavCollapsed  =true;
          if ((angular.isDefined($cookieStore.get('sideNavCollapsed')) && $cookieStore.get('sideNavCollapsed')) || $rootScope.sideNavCollapsed) {
            if ($scroller) {
              $scroller.destroy();
            }
          }
        }
      };
    }];
  return directive;
});
