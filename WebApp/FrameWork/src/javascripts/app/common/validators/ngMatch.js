define(function(require) {
  'use strict';
  var angular = require('angular');
  var module = angular.module('common.validators.ngMatch', []);
  module.directive('ngMatch', [function() {
    return {
      require: "ngModel",
      scope: {
        otherModelValue: "=ngMatch"
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
         * validate ngMatch
         * @param modelValue
         * @returns {boolean}
         */
        ngModel.$validators.ngMatch = function (modelValue) {
          return modelValue === scope.otherModelValue;
        };

        scope.$watch("otherModelValue", function () {
          ngModel.$validate();
        });
      }
    };
  }]);
  return module.name;
});
