define(function (require) {
  'use strict';
  var angular = require('angular'),
    _ = require('lodash'),
    module;

  module = angular.module('common.directives.cKendoMultiSelect', []);

  module.directive('cKendoMultiSelect', [
    '$timeout',
    function ($timeout) {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          source: '=ngSource',
          options: '=',
          placeholder: '@',
          noItemMessage: '@',
          addNew: '&'
        },
        controllerAs: 'vm',
        bindToController: true,
        controller: [
          '$scope',
          function ($scope) {
            var vm = this;
            vm.options = vm.options || {};
            vm.placeholder = vm.placeholder || '';
            vm.noItemMessage = vm.noItemMessage || "No item";
          }
        ],
        /**
         * link function
         * @param scope
         * @param element
         * @param attrs
         * @param ngModel
         */
        link: function (scope, element, attrs, ngModel) {
          var options = angular.extend({
            /**
             * change fn
             * @param e
             */
            change: function (e) {
              var value = this.value();

              $timeout(function(){
                scope.$apply(function () {
                  ngModel.$setViewValue(_.map(value, function (v) {
                    return v + '';
                  }));
                });
              });

            },
            /**
             * select fn
             * @param e
             */
            select: function (e) {
              if (e.item.text() === scope.vm.noItemMessage) {
                e.preventDefault();
              }
            }
          }, scope.vm.options);

          /**
           * add no item
           */
          function addNoItem() {
            var noItem = {};
            noItem[options.dataTextField] = scope.vm.noItemMessage;
            noItem[options.dataValueField] = scope.vm.noItemMessage;
            scope.vm.source = [noItem];
          }

          // Add placeholder
          element.attr('data-placeholder', scope.vm.placeholder);

          var optional = element.kendoMultiSelect(options).data("kendoMultiSelect");

          //catch event enter on multiselect input
          optional.input.bind('keypress', function(e){
            var code = e.keyCode || e.which;

            if(code === 13) {
              e.preventDefault();

              var kInputValue = angular.element(optional.input).val();

              if(scope.vm.addNew && kInputValue) {
                scope.vm.addNew({
                  tagName: kInputValue
                });
              }
            }
          });

          scope.$watchCollection('vm.source', function (val) {
            optional.dataSource.data(scope.vm.source);
            optional.value(ngModel.$viewValue);
            if (!scope.vm.source || !scope.vm.source.length) {
              addNoItem();
            }
          });

          scope.$on('cKendoMultiSelect:UpdateValue', function () {
            optional.value(ngModel.$viewValue);
          });

        }
      };
    }]);

  return module.name;
});
