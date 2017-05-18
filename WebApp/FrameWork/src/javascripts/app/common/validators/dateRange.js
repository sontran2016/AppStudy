define(function(require){
  'use strict';
  var angular = require('angular'),
    moment = require('moment');

  var module = angular.module('common.validators.dateRange', []);
  module.directive('dateRange', ['$parse', function($parse){
    return {
      require: 'ngModel',
      /**
       * link function
       * @param scope
       * @param element
       * @param attrs
       * @param ngModel
       */
      link: function(scope, element, attrs, ngModel){

        /**
         * function validate greater than max date
         * @param modelValue
         * @returns {*}
         */
        ngModel.$validators.gtMaxDate = function(modelValue){
          if(attrs.minDate) {
            var maxDateValue = angular.copy($parse(attrs.minDate)(scope));
            if(!maxDateValue) {
              return true;
            }
            return moment(modelValue).isValid() && moment(maxDateValue).isValid() && moment(modelValue).diff(moment(maxDateValue), 'days') >= 0;
          }
          return true;
        };

        /**
         * function validate less than min date
         * @param modelValue
         * @returns {*}
         */
        ngModel.$validators.ltMinDate = function(modelValue){
          if(attrs.maxDate) {
            var minDateValue = angular.copy($parse(attrs.maxDate)(scope));
            if(!minDateValue) {
              return true;
            }
            return moment(modelValue).isValid() && moment(minDateValue).isValid() && moment(minDateValue).diff(moment(modelValue), 'days') >= 0;
          }
          return true;
        };
      }
    };
  }]);
  return module.name;
});
