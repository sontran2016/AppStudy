define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    '$state',
    'symptomFactory',
    '$translate',
    'data',
    function ($state,
              symptomFactory,
              $translate,
              data) {

      var vm = this;

      /**
       * setLineDataSource
       */
      function setLineDataSource() {
        var areaIds = _.map(vm.addModel.areaIds, 'id');
        vm.lineList = _.filter(data.lines, function (obj) {
          return areaIds.indexOf(obj.areaId) >= 0 && obj.isActive === true;
        });
      }

      /**
       * setMachineDataSource
       */
      function setMachineDataSource() {
        var lineIds = _.map(vm.addModel.lineIds, 'id');
        vm.machineList = _.filter(data.machines, function (obj) {
          return lineIds.indexOf(obj.lineId) >= 0 && obj.isActive === true;
        });
      }

      /**
       * setComponentDataSource
       */
      function setComponentDataSource() {
        var machineIds = _.map(vm.addModel.machineIds, 'id');
        vm.componentList = _.filter(data.components, function (obj) {
          var machineComponentIds = _.map(obj.machines, 'id');
          return _.intersection(machineIds, machineComponentIds).length > 0 && obj.isActive === true;
        });
      }

      /**
       * filter lines belong to selected area
       */
      function filterLines() {
        vm.addModel.lineIds = [];
        vm.addModel.machineIds = [];
        vm.addModel.componentIds = [];
        setLineDataSource();
        setMachineDataSource();
        setComponentDataSource();
      }

      /**
       * filter machines belong to selected area and line
       */
      function filterMachines() {
        vm.addModel.machineIds = [];
        vm.addModel.componentIds = [];
        setMachineDataSource();
        setComponentDataSource();
      }

      /**
       * filter component belong to selected area, line and machine
       */
      function filterComponents() {
        vm.addModel.componentIds = [];
        setComponentDataSource();
      }

      /**
       * Add new symptom
       */
      function save() {
        symptomFactory.addNew(vm.addModel).then(function () {
          if (vm.addAnother) {
            vm.addModel = angular.copy(vm.addModelBak);
            vm.formAdd.$setPristine();
          } else {
            $state.go('app.symptom');
          }
        });
      }

      vm.areas = _.filter(data.areas, function (obj) {
        return obj.isActive === true;
      });
      vm.lines = data.lines;
      vm.machines = data.machines;
      vm.components = data.components;
      vm.lineList = [];
      vm.machineList = [];
      vm.componentList = [];

      vm.addModelBak = {
        "description": "",
        "areaIds": [],
        "lineIds": [],
        "machineIds": [],
        "componentIds": [],
        "isActive": true
      };

      vm.addModel = angular.copy(vm.addModelBak);

      vm.save = save;
      vm.filterLines = filterLines;
      vm.filterMachines = filterMachines;
      vm.filterComponents = filterComponents;

    }];
  return controller;
});
