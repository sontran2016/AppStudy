define(function (require) {
  'use strict';
  var angular = require('angular'),
    module;
  module = angular.module('common.directives.cKendoDatepicker', []);
  module.directive('cKendoDatepicker', [
    '$timeout',
    'utilFactory',
    '$rootScope',
    function ($timeout,
              utilFactory,
              $rootScope) {

      /**
       *
       * @param scope
       * @param elem
       * @param attrs
       * @param ngModel
       */
      function linkFn(scope, elem, attrs, ngModel) {

        var instance, options = angular.copy(scope.vm.options), inputId = attrs.id;
        $timeout(function () {
          // generate id
          if (!inputId) {
            inputId = utilFactory.makeId(10);
          }

          // Add id attribute
          attrs.$set('id', inputId);
          // Fix max, min value
          if (angular.isDefined(options.max) && options.max !== null && options.max === "") {
            options.max = new Date(2100, 1, 1);
          }

          if (angular.isDefined(options.min) && options.min !== null && options.min === "") {
            options.min = new Date(1970, 1, 1);
          }

          // Set default value
          if (ngModel.$viewValue) {
            options.value = new Date(ngModel.$viewValue);
          }

          /**
           * update ngModel
           */
          options.change = function () {
            var value = this.value();
            scope.$apply(function () {
              ngModel.$setViewValue(value);
            });
          };

          if (options.showClearButton) {
            options.footer = "<button type='button' class='btn btn-xs btn-danger btn-cleardate' data-datepickerid='" + inputId + "'>Clear</button>";
          }

          // show out of min/max range dates as disabled
          options.month = {
            empty: '<span class="k-state-disabled no-drop-cursor">#= data.value #</span>'
          };


          options.parseFormats = ["yyyy-MM-ddTHH:mm:ss"]; // Add this line to bind correct
          instance = elem.kendoDatePicker(options).data("kendoDatePicker");

          angular.element(document).off('click', '[data-datepickerid="' + inputId + '"]');
          angular.element(document).on('click', '[data-datepickerid="' + inputId + '"]', function (e) {
            var elemId = angular.element(e.target).attr('data-datepickerid');
            var targetElem = angular.element('#' + elemId);
            var elemScope = targetElem.scope();
            var dt = targetElem.data("kendoDatePicker");

            // Update input value
            dt.value(null);

            ngModel.$setViewValue(null);
          });

          // Watch max, min date and update range
          scope.$watch('vm.options.max', function (value) {
            if (value) {
              instance.setOptions({
                max: new Date(value)
              });
            } else {
              instance.setOptions({
                max: new Date(2100, 1, 1)
              });
            }
          });
          scope.$watch('vm.options.min', function (value) {
            if (value) {
              instance.setOptions({
                min: new Date(value)
              });
            } else {
              instance.setOptions({
                min: new Date(1970, 1, 1)
              });
            }
          });

          // Watch model change and update 
          scope.$watch(function () {
            return ngModel.$modelValue;
          }, function (newV) {
            if (!newV) {
              instance.value(null);
            } else {
              instance.value(newV);
            }
          });


          scope.vm.instance = instance;

          scope.$on('$destroy', function () {
            angular.element(document).off('click', '[data-datepickerid="' + inputId + '"]');
          });
        });
      }

      /**
       * controllerFn
       */
      function controllerFn() {
      }

      return {
        restrict: 'A',
        require: 'ngModel',
        link: linkFn,
        controller: controllerFn,
        bindToController: true,
        controllerAs: 'vm',
        scope: {
          instance: '=',
          options: '='
        }
      };
    }]);
  return module.name;
});
