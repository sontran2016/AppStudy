define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    '$state',
    'machineFactory',
    'data',
    function ($state,
              machineFactory,
              data) {

      var vm = this;

      /**
       * Add new machine
       */
      function save() {
        machineFactory.addNew(vm.addModel).then(function () {
          if (vm.addAnother) {
            vm.addModel = angular.copy(vm.addModelBak);
            vm.formAdd.$setPristine();
          } else {
            $state.go('app.machine');
          }
        });
      }

      vm.addModelBak = {
        name: '',
        shortName: '',
        lineId: null,
        isActive: true,
      };

      vm.addModel = angular.copy(vm.addModelBak);
      vm.lines = data;

      vm.save = save;

    }];
  return controller;
});
