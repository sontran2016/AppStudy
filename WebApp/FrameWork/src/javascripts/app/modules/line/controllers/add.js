define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    '$state',
    'data',
    'lineFactory',
    function ($state,
              data,
              lineFactory) {
      
      var vm = this;

      /**
       * Add new line
       */
      function save() {
        lineFactory.addNew(vm.addModel).then(function (resp) {
          if (vm.addAnother) {
            vm.addModel = angular.copy(vm.addModelBak);
            vm.formAdd.$setPristine();
          } else {
            $state.go('app.line');
          }
        });
      }

      vm.addModelBak = {
        name: '',
        shortName: '',
        areaId: null,
        isActive: true,
      };

      vm.addModel = angular.copy(vm.addModelBak);
      vm.areas = data;

      vm.save = save;

    }];
  return controller;
});
