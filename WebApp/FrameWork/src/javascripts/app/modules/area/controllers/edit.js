define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    'areaFactory',
    'areaModel',
    '$state',
    function (areaFactory,
              areaModel,
              $state) {
      var vm = this;

      /**
       * Update area
       */
      function save() {
        areaFactory.updateInfo(vm.areaModel).then(function () {
          $state.go('app.area');
        });
      }

      // Declare states
      vm.areaModel = areaModel;

      // Declare methods
      vm.save = save;

    }];
  return controller;
});
