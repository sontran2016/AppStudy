define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    'tagFactory',
    'tagModel',
    '$state',
    function (tagFactory,
              tagModel,
              $state) {
      var vm = this;

      /**
       * Update tag information
       */
      function save() {
        vm.tagModel.tagId = $state.params.id;
        tagFactory.updateInfo(vm.tagModel).then(function () {
          $state.go('app.tag');
        });
      }

      // Declare states
      vm.tagModel = tagModel;

      // Declare methods
      vm.save = save;
    }];
  return controller;
});
