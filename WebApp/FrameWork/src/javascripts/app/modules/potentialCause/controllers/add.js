define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    '$state',
    'potentialCauseFactory',
    '$translate',
    'issueList',
    function ($state,
              potentialCauseFactory,
              $translate,
              issueList) {

      var vm = this;

      /**
       * Get symptom list
       */
      function getSymptoms() {
        potentialCauseFactory.getAllSymptoms().then(function (resp) {
          vm.symptoms = _.filter(resp.data.symptoms, function (obj) {
            return obj.isActive === true;
          });
        });
      }

      /**
       * Add new potential cause
       */
      function save() {
        vm.addModel.symptomId = vm.addModel.symptomId.toString();
        potentialCauseFactory.addNew(vm.addModel).then(function () {
          if (vm.addAnother) {
            vm.addModel = angular.copy(vm.addModelBak);
            vm.formAdd.$setPristine();
          } else {
            $state.go('app.potentialCause');
          }
        });
      }

      vm.addModelBak = {
        description: '',
        symptomId: null,
        issueId: null,
        isActive: true,
      };

      vm.addModel = angular.copy(vm.addModelBak);
      vm.issueList = angular.copy(issueList);

      vm.save = save;

      getSymptoms();

    }];
  return controller;
});
