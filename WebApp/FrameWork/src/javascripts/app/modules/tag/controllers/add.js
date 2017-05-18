define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    '$state',
    'tagFactory',
    function ($state,
              tagFactory) {
      var vm = this;


      /**
       * generateEmptyAddModel
       * @param isAnother
       * @param isActive
       */
      function generateEmptyAddModel(isAnother, isActive) {
        // Declare states
        vm.addModel = {
          "id": 0,
          "name": "",
          "description": "",
          "isActive": isActive,
          "isAnother": isAnother
        };
      }

      /**
       * Add new area
       */
      function save() {
        tagFactory.addNew(vm.addModel)
          .then(function () {
            if (vm.addModel.isAnother) {
              vm.generateEmptyAddModel(true, vm.addModel.isActive);
              vm.formAdd.$setPristine();
            } else {
              $state.go('app.tag');
            }
          });
      }

      // Declare methods
      vm.generateEmptyAddModel = generateEmptyAddModel;
      vm.save = save;

      generateEmptyAddModel(false, true);
    }];
  return controller;
});
