define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    'machineFactory',
    'machineModel',
    'data',
    '$state',
    function (machineFactory,
              machineModel,
              data,
              $state) {
      var vm = this;

      /**
       * Update machine
       */
      function save() {
        machineFactory.updateInfo(vm.machineModel).then(function () {
          $state.go('app.machine');
        });
      }

      vm.machineModel = machineModel;
      vm.lines = data;

      vm.save = save;

    }];
  return controller;
});
