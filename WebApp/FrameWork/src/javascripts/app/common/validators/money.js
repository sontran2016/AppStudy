define(function(require) {
  'use strict';
  var angular = require('angular');
  var module = angular.module('common.validators.money', []);
  var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;
  var DEFAULT_PRECISION = 2;
  module.directive('ngMoney', ['$parse',function($parse) {
    /**
     * link
     * @param scope
     * @param el
     * @param attrs
     * @param ngModelCtrl
     */
    function link(scope, el, attrs, ngModelCtrl) {
      var minVal, maxVal, precision, lastValidViewValue;
      var isDefined = angular.isDefined;
      var isUndefined = angular.isUndefined;
      var isNumber = angular.isNumber;

      /**
       * Returns a rounded number in the precision setup by the directive
       * @param  {number} num Number to be rounded
       * @return {number}     Rounded number
       */
      function round(num) {
        var d = Math.pow(10, precision);
        return Math.round(num * d) / d;
      }

      /**
       * Returns a string that represents the rounded number
       * @param  {number} value Number to be rounded
       * @return {string}       The string representation
       */
      function formatPrecision(value) {
        return parseFloat(value).toFixed(precision);
      }

      /**
       * check is precission valid
       * @returns {boolean}
       */
      function isPrecisionValid() {
        return !isNaN(precision) && precision > -1;
      }

      /**
       * check if value is valid
       * @param value
       * @returns {boolean}
       */
      function isValueValid(value) {
        return angular.isNumber(value) && !isNaN(value);
      }

      /**
       * change view value
       * @param value
       */
      function changeViewValue(value) {
        ngModelCtrl.$viewValue = value;
        ngModelCtrl.$commitViewValue();
        ngModelCtrl.$render();
      }

      /**
       * update value precission
       */
      function updateValuePrecision() {
        var modelValue = ngModelCtrl.$modelValue;

        if (isValueValid(modelValue) && isPrecisionValid()) {
          ngModelCtrl.$modelValue = round(modelValue);
          $parse(attrs.ngModel).assign(scope, ngModelCtrl.$modelValue);
          changeViewValue(formatPrecision(modelValue));

          // Save the rounded view value
          lastValidViewValue = ngModelCtrl.$viewValue;
        }
      }

      ngModelCtrl.$parsers.push(function (value) {
        if (ngModelCtrl.$isEmpty(value)) {
          lastValidViewValue = value;
          return null;
        }

        // Handle leading decimal point, like ".5"
        if (value.indexOf('.') === 0) {
          value = '0' + value;
        }

        // Allow "-" inputs only when min < 0
        if (value.indexOf('-') === 0) {
          if (minVal >= 0) {
            changeViewValue('');
            return null;
          } else if (value === '-' || value === '-.') {
            return null;
          }
        }

        if (NUMBER_REGEXP.test(value)) {
          // Save as valid view value if it's a number
          lastValidViewValue = value;
          return parseFloat(value);
        } else {
          // Render the last valid input in the field
          changeViewValue(lastValidViewValue);
          return lastValidViewValue;
        }
      });


      /**
       * validate min
       * @param value
       * @returns {boolean}
       */
      ngModelCtrl.$validators.min = function (value) {
        return ngModelCtrl.$isEmpty(value) || isUndefined(minVal) || value >= minVal;
      };
      if (isDefined(attrs.min) || attrs.ngMin) {
        attrs.$observe('min', function(val) {
          if (isDefined(val) && !isNumber(val)) {
            val = parseFloat(val, 10);
          }
          minVal = isNumber(val) && !isNaN(val) ? val : undefined;
          ngModelCtrl.$validate();
        });
      } else {
        minVal = 0;
      }


      if (isDefined(attrs.max) || attrs.ngMax) {
        /**
         * validate max
         * @param value
         * @returns {boolean}
         */
        ngModelCtrl.$validators.max = function(value) {
          return ngModelCtrl.$isEmpty(value) || isUndefined(maxVal) || value <= maxVal;
        };

        attrs.$observe('max', function(val) {
          if (isDefined(val) && !isNumber(val)) {
            val = parseFloat(val, 10);
          }
          maxVal = isNumber(val) && !isNaN(val) ? val : undefined;
          ngModelCtrl.$validate();
        });
      }

      // Round off (disabled by "-1")
      if (isDefined(attrs.precision)) {
        attrs.$observe('precision', function (value) {
          precision = parseInt(value, 10);

          updateValuePrecision();
        });
      } else {
        precision = DEFAULT_PRECISION;
      }

      ngModelCtrl.$parsers.push(function (value) {
        if (value) {
          // Round off value to specified precision
          value = isPrecisionValid() ? round(value) : value;
        }
        return value;
      });

      ngModelCtrl.$formatters.push(function (value) {
        if (value) {
          return isPrecisionValid() && isValueValid(value) ?
            formatPrecision(value) : value;
        } else {
          return '';
        }
      });

      // Auto-format precision on blur
      el.bind('blur', updateValuePrecision);
    }

    return {
      restrict: 'A',
      require: 'ngModel',
      link: link
    };
  }]);
  return module.name;
});
