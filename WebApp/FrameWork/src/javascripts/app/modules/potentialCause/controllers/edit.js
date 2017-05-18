define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    'potentialCauseFactory',
    'commonFactory',
    'potentialCauseModel',
    '$translate',
    '$state',
    'issueList',
    function (potentialCauseFactory,
              commonFactory,
              potentialCauseModel,
              $translate,
              $state,
              issueList) {
      var vm = this;

      /**
       * Update potential cause
       */
      function save() {
        vm.potentialCauseModel.symptomId = vm.potentialCauseModel.symptom.id;
        potentialCauseFactory.updateInfo(vm.potentialCauseModel).then(function () {
          $state.go('app.potentialCause');
        });
      }

      /**
       * Get symptom list
       */
      function getSymptoms() {
        potentialCauseFactory.getAllSymptoms().then(function (resp) {
          var listSymptom = _.filter(resp.data.symptoms, function (obj) {
            return obj.isActive === true;
          });
          vm.symptomInstance.dataSource.data(listSymptom);
          vm.potentialCauseModel.symptom = _.find(resp.data.symptoms, {id: vm.potentialCauseModel.symptomId});
        });
      }

      vm.potentialCauseModel = potentialCauseModel;
      vm.issueList = angular.copy(issueList);
      vm.issueList.unshift({
        id: vm.potentialCauseModel.issue.id,
        title: vm.potentialCauseModel.issue.title
      })
      vm.potentialCauseModel.issueId = angular.copy(vm.potentialCauseModel.issue.id);
      vm.issueIdtmp = vm.potentialCauseModel.issue.id;

      vm.symptomOptions = {
        dataSource: {},
        dataTextField: "description",
        dataValueField: "id",
        optionLabel: $translate.instant('TROUBLESHOOT.TYPE_TO_SELECT_SYMPTOM'),
        filter: "contains"
      };

      vm.issueOptions = {
        filtering: function (e) {
          var param = {
            keyword: e.filter.value
          };
          commonFactory.getIssueList(param).then(function (resp) {
            vm.issueList = resp.data;
          });
        }
      };

      vm.save = save;

      getSymptoms();

    }];
  return controller;
});
