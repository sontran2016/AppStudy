define(function (require) {
  'use strict';
  var angular = require('angular'),
    customRatingTpl = require('text!./templates/customRating.html'),
    module;
  module = angular.module('common.directives.customRating', []);

  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('directives/customRating/templates/customRating.html', customRatingTpl);
    }]);

  /**
   * Directive controller
   */
  function CtrFn() {
    var vm = this;

    /**
     * Get number from array
     * @param num
     * @returns {Array}
     */
    function getNumber(num) {
      return new Array(num);
    }


    vm.getNumber = getNumber;
    vm.noEmpty = 5 - vm.rate;
  }

  module.directive('customRating', [
    function () {
      return {
        restrict: 'E',
        scope: {
          rate: '='
        },
        controller: CtrFn,
        controllerAs: 'vm',
        bindToController: true,
        templateUrl: 'directives/customRating/templates/customRating.html'
      };
    }]);
  return module.name;
});
