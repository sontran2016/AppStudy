define(function (require) {
  'use strict';
  var angular = require('angular'),
    module;
  module = angular.module('common.directives.cKendoEditor', []);
  module.directive('cKendoEditor', [
    'appConstant',
    function (constant) {
      /**
       * function linkFn
       * @param scope
       * @param elem
       */
      function linkFn(scope, elem) {
        var $editorElem = elem.children(), instance;
        $('.textarea-editor').trigger('blur');
        if (scope.vm.model) {
          scope.vm.options.content = angular.copy(scope.vm.model);
        }

        /**
         * Set model value
         * @param modelValue
         */
        function setModel(modelValue) {
          scope.vm.instance.exec('inserthtml',{
            value: modelValue
          });
        }

        instance = $editorElem.kendoEditor(scope.vm.options).data("kendoEditor");
        scope.vm.instance = instance;
        setModel(scope.vm.model);
      }

      /**
       * controllerFn
       * @param $scope
       */
      function controllerFn($scope) {

      }

      return {
        restrict: 'E',
        link: linkFn,
        controller: [
          '$scope',
          controllerFn
        ],
        bindToController: true,
        controllerAs: 'vm',
        template: '<textarea class="textarea-editor"></textarea>',
        scope: {
          instance: '=',
          options: '=',
          model: '='
        }
      };
    }]);
  return module.name;
});