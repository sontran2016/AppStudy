define(function (require){
  'use strict';
  var angular = require('angular');
  var module = angular.module('common.validators.greaterThan', []);
  module.directive('greaterThan', function (){
    return {
      require: "ngModel",
      scope: {
        otherModelValue: "=greaterThan"
      },
      /**
       * link function
       * @param scope
       * @param element
       * @param attributes
       * @param ngModel
       */
      link: function (scope, element, attributes, ngModel){

        /**
         * validate greater than
         * @param modelValue
         * @returns {boolean}
         */
        ngModel.$validators.greaterThan = function (modelValue){
          return modelValue >= scope.otherModelValue;
        };

        scope.$watch("otherModelValue", function (){
          ngModel.$validate();
        });
      }
    };
  });
  return module.name;
});
