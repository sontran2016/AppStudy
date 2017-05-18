define(function (require) {
  'use strict';
  var angular = require('angular'),
    roleList = angular.fromJson(require('text!./../../../common/resources/user/role.json'));
  var _ = require('lodash');
  var controller = [
    '$state',
    'userFactory',
    'area',
    'line',
    'machine',
    '$translate',
    '$uibModal',
    function ($state,
              userFactory,
              area,
              line,
              machine,
              $translate,
              $uibModal) {

      var vm = this;

      /**
       * open modal to choose area(s)
       */
      function openAreaModal() {
        var modalInstance = $uibModal.open({
          templateUrl: 'user/templates/modal/selectArea.html',
          controller: 'SelectAreaController',
          controllerAs: 'vm',
          backdrop: 'static',
          size: 'lg',
          resolve: {
            userModel: vm.addModel,
            data: function () {
              return _.filter(vm.areas, function (obj) {
                return obj.isActive === true;
              });
            }
          }
        });

        modalInstance.result.then(function (resp) {
          vm.addModel.areaIds = resp;
          vm.addModel.lineIds = [];
          vm.addModel.machineIds = [];
        });
      }

      /**
       * open modal to choose line(s)
       */
      function openLineModal() {
        var modalInstance = $uibModal.open({
          templateUrl: 'user/templates/modal/selectLine.html',
          controller: 'SelectLineController',
          controllerAs: 'vm',
          backdrop: 'static',
          size: 'lg',
          resolve: {
            userModel: vm.addModel,
            data: function () {
              return _.filter(vm.lines, function (obj) {
                var areaList = _.map(vm.addModel.areaIds, 'id');
                return obj.isActive === true && _.indexOf(areaList, obj.areaId) !== -1;
              });
            }
          }
        });

        modalInstance.result.then (function(resp) {
          vm.addModel.lineIds = resp;
          vm.addModel.machineIds = [];
        });
      }

      /**
       * open modal to choose machine(s)
       */
      function openMachineModal() {
        var modalInstance = $uibModal.open({
          templateUrl: 'user/templates/modal/selectMachine.html',
          controller: 'SelectMachineController',
          controllerAs: 'vm',
          backdrop: 'static',
          size: 'lg',
          resolve: {
            userModel: vm.addModel,
            data: function () {
              return _.filter(vm.machines, function (obj) {
                var lineList = _.map(vm.addModel.lineIds, 'id');
                return obj.isActive === true && _.indexOf(lineList, obj.lineId) !== -1;
              });
            }
          }
        });

        modalInstance.result.then (function(resp) {
          vm.addModel.machineIds = resp;
        });
      }

      function changeRole() {
        if(vm.addModel.role === 'admin') {
          vm.addModel.areaIds = [];
          vm.addModel.lineIds = [];
          vm.addModel.machineIds = [];
        }
      }

      /**
       * Add new user
       */
      function save() {
        if(vm.addModel.role !== 'admin') {
          vm.addModel.areaIds = _.isArray(vm.addModel.areaIds) ? _.map(vm.addModel.areaIds,'id').join(',') : vm.addModel.areaIds;
          vm.addModel.lineIds = _.isArray(vm.addModel.lineIds) ? _.map(vm.addModel.lineIds,'id').join(',') : vm.addModel.lineIds;
          vm.addModel.machineIds = _.isArray(vm.addModel.machineIds) ? _.map(vm.addModel.machineIds,'id').join(',') : vm.addModel.machineIds;
        } else {
          vm.addModel.areaIds = '';
          vm.addModel.lineIds = '';
          vm.addModel.machineIds = '';
        }

        userFactory.addNew(vm.addModel).then(function (resp) {
          if (vm.addAnother) {
            vm.addModel = angular.copy(vm.addModelBak);
            vm.formAdd.$setPristine();
            vm.roleInstance.value('');
          }
          else {
            $state.go('app.user');
          }
        });
      }

      vm.roleList = _.map(roleList, function (value, key) {
        return value;
      });

      vm.roles = roleList;
      vm.areas = area.areas;
      vm.lines = line.lines;
      vm.machines = machine.machines;

      vm.addModelBak = {
        "email": "",
        "firstName": "",
        "lastName": "",
        "password": "",
        "confirmPassword": "",
        "phone": "",
        "role": "",
        "birthday": null,
        "areaIds": [],
        "lineIds": [],
        "machineIds": [],
        "isActive": true,
      };

      vm.addModel = angular.copy(vm.addModelBak);

      vm.showFullArea = false;
      vm.showFullLine = false;
      vm.showFullMachine = false;

      vm.openAreaModal = openAreaModal;
      vm.openLineModal = openLineModal;
      vm.openMachineModal = openMachineModal;
      vm.changeRole = changeRole;
      vm.save = save;

    }];
  return controller;
});
