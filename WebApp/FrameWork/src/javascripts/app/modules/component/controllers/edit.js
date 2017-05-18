define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    'componentFactory',
    'commonFactory',
    'componentModel',
    'dataLine',
    'dataMachine',
    '$state',
    function (componentFactory,
              commonFactory,
              componentModel,
              dataLine,
              dataMachine,
              $state) {

      var vm = this;

      /**
       * set machine data source
       */
      function setMachineDataSource() {
        var param = {
          lineId: vm.componentModel.lineIds.join()
        };
        commonFactory.getCommonMachine(param).then(function (resp) {
          vm.machineList = resp.data;
        });
      }

      /**
       * filter machines belong to selected lines
       */
      function filterMachines() {
        vm.componentModel.machineIds = [];
        setMachineDataSource();
      }

      /**
       * Update component
       */
      function save() {
        vm.componentModel.machineIds = vm.componentModel.machineIds ? _.join(vm.componentModel.machineIds, ',') : null;
        componentFactory.updateInfo(vm.componentModel).then(function () {
          $state.go('app.component');
        });
      }

      vm.componentModel = componentModel;
      vm.lineList = dataLine;
      vm.machineList = dataMachine;
      vm.componentModel.lineIds = _.map(vm.componentModel.lines, 'id');
      vm.componentModel.machineIds = _.map(vm.componentModel.machines, 'id');

      vm.filterMachines = filterMachines;
      vm.save = save;

    }];
  return controller;
});
