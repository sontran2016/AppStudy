define(function (require) {
  'use strict';

  var angular = require('angular');

  var module = angular.module('common.directives.validFile', [])
    .directive('validFile', function () {
      return {
        require: 'ngModel',
        /**
         * link fn
         * @param scope
         * @param el
         * @param attrs
         * @param ngModel
         */
        link: function (scope, el, attrs, ngModel) {

          /**
           * validate file
           */
          function validate() {
            scope.$apply(function () {
              ngModel.$setViewValue(el.val());
            });
          }

          //change event is fired when file is selected
          el.bind('change', validate);
        }
      };
    });

  return module.name;
});
