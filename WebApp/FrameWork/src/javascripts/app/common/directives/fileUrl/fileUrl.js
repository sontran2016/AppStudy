define(function (require) {
  'use strict';
  var angular = require('angular'),
    customRatingTpl = require('text!./templates/fileUrl.html'),
    module;
  module = angular.module('common.directives.fileUrl', []);

  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('directives/fileUrl/templates/fileUrl.html', customRatingTpl);
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

  module.directive('fileUrl', [
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
        templateUrl: 'directives/fileUrl/templates/fileUrl.html'
      };
    }]);
  return module.name;
});
