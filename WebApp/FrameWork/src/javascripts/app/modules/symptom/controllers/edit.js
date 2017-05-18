define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    'symptomFactory',
    'symptomModel',
    '$translate',
    '$state',
    'data',
    function (symptomFactory,
              symptomModel,
              $translate,
              $state,
              data) {
      var vm = this;

      /**
       * Update symptom
       */
      function save() {
        symptomFactory.updateInfo(vm.symptomModel).then(function () {
          $state.go('app.symptom');
        });
      }

      vm.symptomModel = symptomModel;

      vm.save = save;

    }];
  return controller;
});
