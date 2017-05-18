define(function(require) {
  'use strict';
  var angular = require('angular');
  var module = angular.module('common.validators.compareTo', []);
  module.directive('compareTo', function() {
    return {
      require: "ngModel",
      scope: {
        otherModelValue: "=compareTo"
      },
      /**
       * link function
       * @param scope
       * @param element
       * @param attributes
       * @param ngModel
       */
      link: function (scope, element, attributes, ngModel) {

        /**
         * function validate compare
         * @param modelValue
         * @returns {boolean}
         */
        ngModel.$validators.compareTo = function (modelValue) {
          return modelValue === scope.otherModelValue;
        };

        scope.$watch("otherModelValue", function () {
          ngModel.$validate();
        });
      }
    };
  });
  return module.name;
});
