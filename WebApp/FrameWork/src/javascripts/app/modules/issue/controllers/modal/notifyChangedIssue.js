define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    '$state',
    'type',
    '$uibModalInstance',
    '$uibModalStack',
    function ($state,
              type,
              $uibModalInstance,
              $uibModalStack) {

      var vm = this;

      /**
       * close modal and back to trouble list
       */
      function close() {
        $state.go('app.issue');
        $uibModalStack.dismissAll();
      }

      vm.type = angular.copy(type);

      vm.close = close;

    }];
  return controller;
});
