define(function (require) {
  'use strict';
  var angular = require('angular'),
    _ = require('lodash'),
    jQuery = require('jquery'),
    module;
  module = angular.module('common.directives.cKendoChart', []);
  module.directive('cKendoChart', [
    'appConstant',
    function (constant) {
      /**
       * short label
       * @param value
       * @returns {*}
       */
      function shortLabels(value) {
        var maxStrLength = 30;
        if (value.length > maxStrLength) {
          value = value.substring(0, maxStrLength) + '...';
          return value;
        }
        return value;
      }

      /**
       * link function
       * @param scope
       * @param elem
       */
      function linkFn(scope, elem) {
        var kendoChartOpts = scope.vm.chartConfig;
        _.each(scope.vm.chartConfig.events, function (fn, key) {
          kendoChartOpts[key] = fn;
        });

        var currentSelectRange = [];

        /**
         * select end
         * @param e
         */
        kendoChartOpts.selectEnd = function (e) {
          currentSelectRange = [e.from, e.to];
        };
        var chart = elem.find('div').kendoChart(kendoChartOpts);
        scope.vm.instance = chart;
        // For not-supported event
        [{
          name: 'plotAreaHover',
          /**
           * fn area hover
           * @param cb
           */
          fn: function (cb) {
            chart.off('mouseover').on('mouseover', cb);
          }
        },
          {
            name: 'selectionDblClick',
            /**
             * fn selection double click
             * @param cb
             */
            fn: function (cb) {
              chart.on('dblclick', '.k-selection', function () {
                cb(currentSelectRange);
              });
            }
          },
          {
            name: 'wholeChartClick',
            /**
             * fn whole chart click
             * @param cb
             */
            fn: function (cb) {
              chart.on('click', '.k-selector', function (e) {
                cb(e);
              });
            }
          }].forEach(function (event) {
          if (scope.vm.chartConfig.events && scope.vm.chartConfig.events[event.name]) {
            event.fn(scope.vm.chartConfig.events[event.name]);
          }
        });
        // On resize chart function
        var onResizeChart = _.debounce(function () {
          var kendoChartDt = chart.data('kendoChart');
          if (kendoChartDt) {
            // Check if there is min width value
            if(Number(scope.vm.minWidth)){
              // Set min width
              kendoChartDt.options.chartArea.width = (elem.width() > Number(scope.vm.minWidth) ? elem.width() : Number(scope.vm.minWidth));
            }
            kendoChartDt.refresh();
          }
        },500);
        jQuery(window).off('resize.chart').on('resize.chart', onResizeChart);
        onResizeChart();
      }

      /**
       * controller function
       */
      function controllerFn() {

      }

      return {
        restrict: 'E',
        link: linkFn,
        controller: controllerFn,
        template: '<div></div>',
        bindToController: true,
        controllerAs: 'vm',
        scope: {
          chartConfig: '=',
          windowId: '@',
          instance: '=?',
          minWidth: '@'
        }
      };
    }]);
  return module.name;
});
