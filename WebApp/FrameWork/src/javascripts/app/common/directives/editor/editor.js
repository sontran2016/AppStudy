define(function (require) {
  'use strict';
  var angular = require('angular'),
    _ = require('lodash'),
    tpl = require('text!./templates/editor.html'),
    module;
  module = angular.module('common.directives.editor', []);
  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('editor.html', tpl);
    }]);
  module.directive('editor', [
    function () {

      /**
       * function linkFn
       * @param scope
       * @param elem
       */
      function linkFn(scope, elem) {

      }

      /**
       * controllerFn
       * @param $scope
       */
      function controllerFn($scope) {
        var vm = this;
        var userInput = false;

        /**
         * paste
         * @param e
         */
        function paste(e) {
          // todo need to refactor this
          // strip all tag except <p> and <br>
          e.html = e.html.replace(/((?!<((\/)?(p|em|strong|b|i|style)|br))<[^>]*>)/gi, '');
          // strip all p tag attribute
          e.html = e.html.replace(/<\s*p.*?>/gi, '<p>');
          //e.html = $(e.html).text();
        }

        /**
         * key up event on editor
         * @param e
         */
        function keyUp(e) {
          var value = this.value();
          $scope.$apply(function () {
            userInput = true;
            vm.model = value;
          });
        }

        /**
         * Editor tool executing event
         * @param e
         */
        function editorExecution(e) {
          // Update content on executing command
          var value = this.value();
          $scope.$apply(function () {
            vm.model = value;
          });
        }

        vm.options = vm.options || {};
        vm.editorOptions = angular.extend({
          resizable: false,
          paste: paste,
          tools: [
            "fontSize", "foreColor", "bold", "italic", "underline", "strikethrough", "justifyLeft", "justifyCenter", "justifyRight"
          ],
          keyup: _.debounce(keyUp, 100),
          execute: _.debounce(editorExecution, 100)
        }, vm.options);

        $scope.$watch('vm.model', function () {
          if (vm.editorInstance) {
            vm.editorInstance.value(angular.copy(vm.model));
          }
        });
      }

      return {
        restrict: 'E',
        controller: [
          '$scope',
          controllerFn
        ],
        templateUrl: 'editor.html',
        bindToController: true,
        controllerAs: 'vm',
        scope: {
          model: '='
        },
        link: linkFn
      };
    }]);
  return module.name;
});
