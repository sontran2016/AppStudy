define(function (require) {
  'use strict';
  var angular = require('angular'),
    customFileTpl = require('text!./templates/fileImage.html'),
    module;
  module = angular.module('common.directives.fileImage', []);

  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('directives/fileImage/templates/fileImage.html', customFileTpl);
    }]);

  /**
   * Directive controller for fileURl
   * @param appConstant
   */
  function CtrFn(appConstant) {
    var vm = this;
    vm.appConstant = appConstant;
    vm.file = vm.ngModel;
  }

  module.directive('fileImage', [
    function () {
      return {
        restrict: 'E',
        scope: {
          ngModel: '='
        },
        /**
         * Directive controller
         */
        controller: [
          'appConstant',
          CtrFn
        ],
        controllerAs: 'vm',
        bindToController: true,
        templateUrl: 'directives/fileImage/templates/fileImage.html'
      };
    }]);
  return module.name;
});
