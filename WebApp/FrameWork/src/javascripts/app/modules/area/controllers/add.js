define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    '$state',
    'areaFactory',
    function ($state,
              areaFactory) {
      var vm = this;

      /**
       * generateEmptyAddModel
       * @param isAddAnother
       */
      function generateEmptyAddModel(isAddAnother) {
        vm.addModel = {
          name: '',
          shortName: '',
          description: '',
          isActive: true,
        };
      }

      /**
       * Add new area
       */
      function save() {
        areaFactory.addNew(vm.addModel).then(function () {
          if (vm.isAnother) {
            generateEmptyAddModel(true);
            vm.formAdd.$setPristine();
          } else {
            $state.go('app.area');
          }
        });
      }

      vm.save = save;

      generateEmptyAddModel(false);

    }];
  return controller;
});
