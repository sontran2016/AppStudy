define(function (require){
  'use strict';
  var angular = require('angular');
  var module = angular.module('common.validators.number', []);
  module.directive('ngNumber', function (){
    return {
      require: 'ngModel',
      restrict: 'A',
      /**
       * link function
       * @param scope
       * @param elem
       * @param attrs
       * @param ngModel
       */
      link: function (scope, elem, attrs, ngModel){

        /**
         * validate number
         * @param value
         * @returns {boolean}
         */
        ngModel.$validators.number = function (value){
          var valid = /^\d+$/.test(value);
          return valid;
        };

        /**
         * validate min number
         * @param value
         * @returns {boolean}
         */
        ngModel.$validators.numberMin = function (value){
          var valid = /^\d+$/.test(value);
          if (valid) {
            if (attrs.min && value < parseInt(attrs.min, 10)) {
              valid = false;
            }
          }
          return valid;
        };

        /**
         * validate max number
         * @param value
         * @returns {boolean}
         */
        ngModel.$validators.numberMax = function (value){
          var valid = /^\d+$/.test(value);
          if (valid) {
            if (attrs.max && value > parseInt(attrs.max, 10)) {
              valid = false;
            }
          }
          return valid;
        };

        /**
         * validate number min length
         * @param value
         * @returns {boolean}
         */
        ngModel.$validators.numberMinLength = function (value){
          var valid = /^\d+$/.test(value);
          if (valid) {
            if (attrs.minLength && value.length < parseInt(attrs.minLength, 10)) {
              valid = false;
            }
          }
          return valid;
        };

        /**
         * validate number max length
         * @param value
         * @returns {boolean}
         */
        ngModel.$validators.numberMaxLength = function (value){
          var valid = /^\d+$/.test(value);
          if (valid) {
            if (attrs.maxLength && value.length > parseInt(attrs.maxLength, 10)) {
              valid = false;
            }
          }
          return valid;
        };
      }
    };
  });
  return module.name;
});
