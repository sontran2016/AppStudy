define(function(require) {
  'use strict';
  var angular = require('angular');
  var controller = [
    '$uibModalInstance',
    'fileTypes',
    'multiple',
    function($uibModalInstance,
             fileTypes,
             multiple) {

      var vm = this;

      /**
       * ok
       */
      function ok() {
        $uibModalInstance.close(vm.files);
      }

      /**
       * cancel
       */
      function cancel() {
        $uibModalInstance.dismiss('cancel');
      }

      vm.multiple = multiple;
      vm.fileTypes = fileTypes;
      vm.files = [];
      vm.ok = ok;
      vm.cancel = cancel;
    }];
  return controller;
});
