define(function (require) {
  'use strict';
  var angular = require('angular'),
    roleList = angular.fromJson(require('text!./../../../common/resources/user/role.json')),
    _ = require('lodash');

  var controller = [
    '$state',
    'userFactory',
    'area',
    'line',
    'machine',
    'userModel',
    '$translate',
    'userContext',
    '$uibModal',
    function ($state,
              userFactory,
              area,
              line,
              machine,
              userModel,
              $translate,
              userContext,
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
            userModel: vm.userModel,
            data: function () {
              return _.filter(vm.areas, function (obj) {
                return obj.isActive === true;
              });
            }
          }
        });

        modalInstance.result.then(function (resp) {
          vm.userModel.areaIds = resp;
          vm.userModel.lineIds = [];
          vm.userModel.machineIds = [];
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
            userModel: vm.userModel,
            data: function () {
              return _.filter(vm.lines, function (obj) {
                var areaList = _.map(vm.userModel.areaIds, 'id');
                return obj.isActive === true && _.indexOf(areaList, obj.areaId) !== -1;
              });
            }
          }
        });

        modalInstance.result.then (function(resp) {
          vm.userModel.lineIds = resp;
          vm.userModel.machineIds = [];
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
            userModel: vm.userModel,
            data: function () {
              return _.filter(vm.machines, function (obj) {
                var lineList = _.map(vm.userModel.lineIds, 'id');
                return obj.isActive === true && _.indexOf(lineList, obj.lineId) !== -1;
              });
            }
          }
        });

        modalInstance.result.then (function(resp) {
          vm.userModel.machineIds = resp;
        });
      }

      function changeRole() {
        if(vm.userModel.role === 'admin') {
          vm.userModel.areaIds = [];
          vm.userModel.lineIds = [];
          vm.userModel.machineIds = [];
        } else {
          vm.userModel.areaIds = vm.areaIdstmp;
          vm.userModel.lineIds = vm.lineIdstmp;
          vm.userModel.machineIds = vm.machineIdstmp;
        }
      }

      /**
       * Update user
       */
      function save() {
        if(vm.userModel.role === 'user') {
          vm.userModel.areaIds = _.isArray(vm.userModel.areaIds) ? _.map(vm.userModel.areaIds,'id').join(',') : vm.userModel.areaIds;
          vm.userModel.lineIds = _.isArray(vm.userModel.lineIds) ? _.map(vm.userModel.lineIds,'id').join(',') : vm.userModel.lineIds;
          vm.userModel.machineIds = _.isArray(vm.userModel.machineIds) ? _.map(vm.userModel.machineIds,'id').join(',') : vm.userModel.machineIds;
        } else {
          vm.userModel.areaIds = '';
          vm.userModel.lineIds = '';
          vm.userModel.machineIds = '';
        }

        var putModel ={
          "firstName": vm.userModel.firstName,
          "lastName": vm.userModel.lastName,
          "email": vm.userModel.email,
          "avatarUrl": vm.userModel.avatarUrl ? vm.userModel.avatarUrl.fileUrl : null,
          "phone": vm.userModel.phone,
          "birthday": vm.userModel.birthday,
          "areaIds": vm.userModel.areaIds,
          "lineIds": vm.userModel.lineIds,
          "machineIds": vm.userModel.machineIds,
          "role": vm.userModel.role,
          "isActive": vm.userModel.isActive,
          "pictureId": vm.userModel.pictureId
        };

        userFactory.updateInfo(vm.userModel.id, putModel).then(function (resp) {
          var userData = userContext.authentication().userData;
          if (userData.id === resp.data.id) {
            userContext.fillInfo(resp.data, true);
          }
          $state.go('app.user');
        });
      }

      vm.roleList = _.map(roleList, function (value, key) {
        return value;
      });

      vm.roles = roleList;
      vm.userModel = userModel;
      vm.areas = area.areas;
      vm.lines = line.lines;
      vm.machines = machine.machines;

      vm.userModel.areaIds = vm.userModel.areas;
      vm.userModel.lineIds = vm.userModel.lines;
      vm.userModel.machineIds = vm.userModel.machines;

      vm.userModel.areaIdsMore = vm.userModel.areaIds.slice(10);
      vm.userModel.lineIdsMore = vm.userModel.lineIds.slice(10);
      vm.userModel.machineIdsMore = vm.userModel.machineIds.slice(10);

      vm.roletmp = userModel.role;
      vm.areaIdstmp = angular.copy(userModel.areas);
      vm.lineIdstmp = angular.copy(userModel.lines);
      vm.machineIdstmp = angular.copy(userModel.machines);

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
