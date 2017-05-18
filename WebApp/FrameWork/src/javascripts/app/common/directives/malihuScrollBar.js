define(function(require) {
  'use strict';
  var angular = require('angular'),
    _ = require('lodash'),
    jQuery = require('jquery'),
    malihuScrollBar = require('malihuScrollBar'),
    module;
  module = angular.module('common.directives.malihuScrollBar', []);
  module.factory('MalihuScroller', ['$rootScope', function($rootScope) {
    return function(scrollId) {
      var $this = this;
      this.id = scrollId;
      this.atBottom = false;

      /**
       * update scroll
       */
      this.updateScroll = function() {
        $rootScope.$broadcast('malihuScrollBar.' + scrollId + '.updateScroll');
      };

      /**
       * scroll to
       * @param e
       */
      this.scrollTo = function(e) {
        $rootScope.$broadcast('malihuScrollBar.' + scrollId + '.scrollTo', e);
      };

      /**
       * destroy
       */
      this.destroy = function() {
        $rootScope.$broadcast('malihuScrollBar.' + scrollId + '.destroy');
      };

      /**
       * create
       */
      this.create = function() {
        $rootScope.$broadcast('malihuScrollBar.' + scrollId + '.create');
      };
    };
  }]);
  module.factory('$malihuScroll', [function() {
    var scrollers = [],
      services = {};

    /**
     * add
     * @param scroller
     */
    services.add = function(scroller) {
      scrollers.push(scroller);
    };

    /**
     * remove
     * @param id
     */
    services.remove = function(id) {
      _.remove(scrollers, {id: id});
    };

    /**
     * update
     * @param id
     * @param obj
     */
    services.update = function(id, obj) {
      var found = services.get(id);
      if(found) {
        var idx = _.findIndex(scrollers, {id: id});
        scrollers[idx] = angular.extend(found, obj);
      }
    };

    /**
     * get
     * @param id
     * @returns {*}
     */
    services.get = function(id) {
      if(id) {
        return _.find(scrollers, {id: id});
      } else {
        return scrollers[scrollers.length - 1];
      }
    };

    return services;
  }]);
  module.directive('malihuScrollBar', [
    '$parse',
    '$malihuScroll',
    'utilFactory',
    '$rootScope',
    'MalihuScroller',
    '$timeout',
    function($parse,
             $malihuScroll,
             utilFactory,
             $rootScope,
             MalihuScroller,
             $timeout) {
      return {
        restrict: 'A',

        /**
         * link fn
         * @param scope
         * @param elem
         * @param attrs
         */
        link: function(scope, elem, attrs) {
          var scrollId = attrs.malihuScrollBar || utilFactory.makeId(5),
            scroller = new MalihuScroller(scrollId);

          $malihuScroll.add(scroller);

          var options = {
            callbacks: {
              /**
               * on scroll
               */
              onScroll: function() {
                scroller.atBottom = this.mcs.topPct === 100;
              }
            }
          };

          options = angular.extend({}, options, $parse(attrs.malihuScrollBarOptions)(scope));

          elem.mCustomScrollbar(options);

          //elem.mCustomScrollbar({
          //  axis: "y", // horizontal scrollbar
          //  scrollInertia: 200,
          //  scrollbarPosition: "outside",
          //  callbacks: {
          //    onScroll: function() {
          //      scroller.atBottom = this.mcs.topPct === 100;
          //    }
          //  }
          //});

          scope.$on('malihuScrollBar.update', function() {
            elem.mCustomScrollbar("update");
          });

          scope.$on('malihuScrollBar.' + scrollId + '.updateScroll', function() {
            elem.mCustomScrollbar("update");
          });

          scope.$on('malihuScrollBar.' + scrollId + '.scrollTo', function(e, dt) {
            $timeout(function() {
              elem.mCustomScrollbar("scrollTo", dt);
            });
          });

          scope.$on('malihuScrollBar.' + scrollId + '.destroy', function() {
            elem.mCustomScrollbar("destroy");
          });

          scope.$on('malihuScrollBar.' + scrollId + '.create', function() {
            elem.mCustomScrollbar(options);
          });

          scope.$on('$destroy', function() {
            elem.mCustomScrollbar("destroy");
            $malihuScroll.remove(scrollId);
          });
        }
      };
    }]);
  return module.name;
});
