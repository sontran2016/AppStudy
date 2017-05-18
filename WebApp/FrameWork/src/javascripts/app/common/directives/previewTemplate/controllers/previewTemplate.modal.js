define(function(require) {
  'use strict';
  var angular = require('angular');
  var controller = [
    '$uibModalInstance',
    'url',
    'fileName',
    '$sce',
    'fileFactory',
    function($uibModalInstance,
      url,
      fileName,
      $sce,
      fileFactory) {

      var vm = this;

      /**
       * Cancel
       */
      function cancel() {
        $uibModalInstance.dismiss('cancel');
      }

      vm.url = url;
      vm.fileName = fileName;

      vm.cancel = cancel;
      vm.getSrc = fileFactory.getSrc;
      vm.getDocumentSrc = fileFactory.getDocumentSrc;

      vm.fileType = fileFactory.getFileType(fileFactory.getFileExtension(vm.fileName));
    }
  ];
  return controller;
});
