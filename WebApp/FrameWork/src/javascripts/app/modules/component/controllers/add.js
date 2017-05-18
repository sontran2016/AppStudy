define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    '$state',
    'componentFactory',
    'commonFactory',
    'dataLine',
    'dataMachine',
    function ($state,
              componentFactory,
              commonFactory,
              dataLine,
              dataMachine) {

      var vm = this;

      /**
       * set machine data source
       */
      function setMachineDataSource() {
        var param = {
          lineId: vm.addModel.lineIds.join()
        };
        commonFactory.getCommonMachine(param).then(function (resp) {
          vm.machineList = resp.data;
        });
      }

      /**
       * filter machines belong to selected lines
       */
      function filterMachines() {
        vm.addModel.machineIds = [];
        setMachineDataSource();
      }

      /**
       * Add new component
       */
      function save() {
        vm.addModel.lineIds = vm.addModel.lineIds ? _.join(vm.addModel.lineIds, ',') : null;
        vm.addModel.machineIds = vm.addModel.machineIds ? _.join(vm.addModel.machineIds, ',') : null;
        componentFactory.addNew(vm.addModel).then(function () {
          if (vm.isAnother) {
            vm.addModel = angular.copy(vm.addModelBak);
            vm.formAdd.$setPristine();
          } else {
            $state.go('app.component');
          }
        });
      }

      vm.addModelBak = {
        name: '',
        shortName: '',
        machineIds: [],
        lineIds: [],
        isActive: true,
      };

      vm.isAnother = false;
      vm.addModel = angular.copy(vm.addModelBak);
      vm.machines = dataMachine;
      vm.lineList = dataLine;

      vm.filterMachines = filterMachines;
      vm.save = save;

    }];
  return controller;
});
