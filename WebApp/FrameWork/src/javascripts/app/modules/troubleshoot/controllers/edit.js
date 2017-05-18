define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var typeFile = angular.fromJson(require('text!app/common/resources/common/fileType.json'));
  var controller = [
    '$scope',
    'troubleshootFactory',
    'potentialCauseFactory',
    'tag',
    'troubleshootModel',
    'fileFactory',
    '$translate',
    '$uibModal',
    'commonFactory',
    'tagFactory',
    '$state',
    'user',
    'notifications',
    'signalRFactory',
    function ($scope,
              troubleshootFactory,
              potentialCauseFactory,
              tag,
              troubleshootModel,
              fileFactory,
              $translate,
              $uibModal,
              commonFactory,
              tagFactory,
              $state,
              user,
              notifications,
              signalRFactory) {

      var vm = this;

      /**
       * generateModel
       */
      function generateModel() {
        vm.troubleshootModel.tagIds = _.map(vm.troubleshootModel.tags, "id");
        vm.troubleshootModel.resourceIds = _.map(vm.troubleshootModel.resources, "fileId");
      }

      /**
       * Upload file
       * @param file
       */
      function uploadFile() {
        if (!vm.files) {
          return;
        }

        fileFactory.upload(vm.files, typeFile.TROUBLESHOOT).then(function (resp) {
          vm.troubleshootModel.resourceIds.push(resp.data.fileId);
          vm.troubleshootModel.resources.push(resp.data);
          vm.files = [];
        });
      }

      /**
       * remove file from list file of troubleshoot
       * @param file
       */
      function removeFile(file) {
        _.remove(vm.troubleshootModel.resources, file);
        _.remove(vm.troubleshootModel.resourceIds, function (resource) {
          return resource === file.fileId;
        });
      }

      /**
       * Add new tag when input in dropdown list tag
       */
      function addNewTag(tagName) {
        var tagModel = {
          "name": tagName,
          "description": "",
          "isActive": true
        };

        tagFactory.addNew(tagModel).then(function (resp) {
          vm.tags.unshift(resp.data);
          vm.troubleshootModel.tagIds.push(resp.data.id);
        });
      }

      /**
       * Update troubleshoot
       */
      function save() {
        var model = {
          "id": vm.troubleshootModel.id,
          "title": vm.troubleshootModel.title,
          "description": vm.troubleshootModel.description,
          "isDDS": vm.troubleshootModel.isDDS,
          "potentialCauseIds": _.map(vm.troubleshootModel.potentialCauses, 'id').join(),
          "resourceIds": vm.troubleshootModel.resourceIds,
          "tagIds": vm.troubleshootModel.tagIds,
          "isActive": vm.troubleshootModel.isActive
        };

        troubleshootFactory.updateInfo(model).then(function () {
          $state.go('app.troubleshootDetails', {id: vm.troubleshootModel.id});
          signalRFactory.troubleHub.deleteTrouble();
        });
      }

      /**
       * down load shooting
       * @param id
       * @returns {*}
       */
      function downLoad(id) {
        troubleshootFactory.downLoadShooting(id);
      }

      /* open modal to notify when this trouble is changed or deleted */
      notifications.onTroubleCountChanged($scope, function (args) {
        if(args.data.TargetId === vm.detailsData.id) {
          var modalInstance = $uibModal.open({
            templateUrl: 'common/templates/notifyChanged.html',
            controller: 'NotifyChangedController',
            controllerAs: 'vm',
            backdrop: 'static',
            keyboard: false,
            windowClass: 'notify-modal',
            size: 'lg',
            resolve: {
              type: function () {
                return 'troubleshoot';
              }
            }
          });
        }
      });

      vm.troubleshootModel = troubleshootModel;
      vm.comments = angular.copy(vm.troubleshootModel.comments);
      vm.isActive = angular.copy(vm.troubleshootModel.isActive);
      vm.tags = tag.tags;

      vm.approvedShooting = _.filter(vm.troubleshootModel.shootings, function (shooting) {
        return shooting.isActive === true;
      });

      vm.save = save;
      vm.uploadFile = uploadFile;
      vm.removeFile = removeFile;
      vm.addNewTag = addNewTag;
      vm.downLoad = downLoad;
      vm.getSrc = fileFactory.getSrc;
      vm.getFileExtension = fileFactory.getFileExtension;
      vm.getFileType = fileFactory.getFileType;

      generateModel();

    }];
  return controller;
});
