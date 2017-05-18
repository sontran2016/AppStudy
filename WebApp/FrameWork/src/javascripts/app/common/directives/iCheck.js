define(function(require) {
  'use strict';
  var angular = require('angular'),
    module = angular.module('common.directives.icheck', []);

  module.directive('icheck', [
    '$timeout',
    function($timeout) {

      /**
       *
       * @param $scope
       * @param element
       * @param $attrs
       * @param ngModel
       * @returns {*}
       */
      function iCheckFn($scope, element, $attrs, ngModel) {
        return $timeout(function() {
          var value = $attrs.value;
          var $element = angular.element(element);

          // Instantiate the iCheck control.
          $element.iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%'
          });

          // If the model changes, update the iCheck control.
          $scope.$watch($attrs.ngModel, function(newValue) {
            $element.iCheck('update');
          });

          $attrs.$observe('disabled', function(nl){
            $element.iCheck('update');
          });

          // If the iCheck control changes, update the model.
          $element.on('ifChanged', function(event) {
            if ($element.attr('type') === 'checkbox') {
              $scope.$apply(function() {
                return ngModel.$setViewValue(event.target.checked);
              });
            }
            if ($element.attr('type') === 'radio') {
              return $scope.$apply(function() {
                return ngModel.$setViewValue(value);
              });
            }
          });

          $scope.$on('$destroy', function(){
            $element.off("ifChanged");
          });
        });
      }

      return {
        require: 'ngModel',
        restrict: "A",
        link: iCheckFn
      };
    }]);

  return module.name;
});