define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    'lineFactory',
    'data',
    'lineModel',
    '$state',
    function (lineFactory,
              data,
              lineModel,
              $state) {

      var vm = this;

      /**
       * Update line
       */
      function save() {
        lineFactory.updateInfo(vm.lineModel.id, vm.lineModel).then(function () {
          $state.go('app.line');
        });
      }

      vm.lineModel = lineModel;
      vm.areas = data;
      vm.areaIdtmp = vm.lineModel.areaId;

      vm.save = save;
      
    }];
  return controller;
});
