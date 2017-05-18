define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var role = require('text!app/common/resources/user/role.json');
  var controller = [
    '$scope',
    '$rootScope',
    'userContext',
    '$uibModalInstance',
    'data',
    'toaster',
    'fileFactory',
    'signalRFactory',
    'notifications',
    'appConstant',
    function ($scope,
              $rootScope,
              userContext,
              $uibModalInstance,
              data,
              toaster,
              fileFactory,
              signalRFactory,
              notifications,
              appConstant) {


      var vm = this;

      /**
       * upload file spreadsheet
       */
      function uploadFile() {
        if (!vm.file) {
          return;
        }

        var validFile = ['xls','xlsx'];
        if(!fileFactory.checkValidFileTypes(vm.file, validFile)) {
          vm.file = [];
          toaster.pop('error', 'Error', 'Please upload only file xls or xlsx');
        } else {
          vm.selectedFile = vm.file[0];
          vm.file = [];
        }
      }

      /**
       * remove file spreadsheet
       */
      function removeFile() {
        vm.file = [];
        vm.selectedFile = null;
      }

      /**
       * download sample template
       */
      function downloadTemplate() {
        if(vm.data.dataType === 'master') {
          window.location.href= appConstant.domain + '/resources/Template-Import-Library.xlsx';
        }
      }

      /**
       * import data
       */
      function importData() {
        fileFactory.importLibraries(vm.selectedFile).success(function (resp) {
          toaster.pop('success','Success', 'Import data successful.');
          vm.selectedFile = null;
          vm.file = [];
          vm.errorList = [];

          var param = {
            id: 0,
            message: vm.currentUser.firstName + ' ' + vm.currentUser.lastName + ' has just imported master data'
          };
          signalRFactory.libraryHub.import(param);

        }).error(function (resp) {
          vm.selectedFile = null;
          vm.file = [];
          vm.errorList = resp;
        });
      }

      /**
       * import file master or troubleshoot
       */
      function importFile(type) {
        if(type === 'master') {
          importData();
        }
      }

      /**
       * close modal
       */
      function close() {
        $uibModalInstance.dismiss('cancel');
      }

      vm.data = angular.copy(data);
      vm.permission = userContext.getPermissions();
      vm.currentUser = $rootScope.currentUserInfo;
      vm.roleList = angular.fromJson(role);

      vm.uploadFile = uploadFile;
      vm.removeFile = removeFile;
      vm.downloadTemplate = downloadTemplate;
      vm.importFile = importFile;
      vm.close = close;

    }];
  return controller;
});
