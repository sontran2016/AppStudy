define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    '$uibModalInstance',
    'issueModel',
    function ($uibModalInstance,
              issueModel) {

      var vm = this;

      /**
       * Close modal
       */
      function close() {
        $uibModalInstance.dismiss('cancel');
      }

      vm.issueModel = angular.copy(issueModel);

      vm.close = close;

    }];
  return controller;
});
