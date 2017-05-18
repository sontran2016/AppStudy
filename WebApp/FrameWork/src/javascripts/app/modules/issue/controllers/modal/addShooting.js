define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var role = require('text!app/common/resources/user/role.json');
  var typeFile = require('text!app/common/resources/common/fileType.json');
  var shootingStatus = require('text!app/common/resources/troubleshoot/status.json');
  var controller = [
    '$state',
    '$rootScope',
    '$uibModalInstance',
    'data',
    'shootingFactory',
    'signalRFactory',
    'fileFactory',
    'stepFactory',
    'troubleshootFactory',
    'toaster',
    'userContext',
    function ($state,
              $rootScope,
              $uibModalInstance,
              data,
              shootingFactory,
              signalRFactory,
              fileFactory,
              stepFactory,
              troubleshootFactory,
              toaster,
              userContext) {

      var vm = this;

      /**
       * Close modal
       */
      function close(shooting) {
		    vm.troubleshootModel.shootings = vm.troubleshootModel.shootings ? vm.troubleshootModel.shootings : [];
		    vm.troubleshootModel.shootings[0] = shooting ? shooting : vm.shootingModel;
        var data = {
          troubleshootModel: vm.troubleshootModel,
          shootingModel: shooting || vm.shootingModel
        };
        $uibModalInstance.close(data);
      }

      /**
       * Upload file
       * @param type
       */
      function uploadFile(type) {
        if (!vm.file) {
          return;
        }

        var validFileShooting = ['doc','docx','pdf'];
        var validFileStep = ['jpg','jpeg','png','gif','bmp','mp4','mov'];

        if(type === vm.typeFile.STEP && !fileFactory.checkValidFileTypes(vm.file, validFileStep)) {
          vm.file = [];
          toaster.pop('error', 'Error', 'Please upload only file image and video (mp4 or mov)');
        } else if(type === vm.typeFile.SHOOTING && !fileFactory.checkValidFileTypes(vm.file, validFileShooting)) {
          vm.file = [];
          toaster.pop('error', 'Error', 'Please upload only file doc, docx, pdf');
        } else {
          if(type === vm.typeFile.STEP) {
            vm.isAddStepFile = true;
          }
          fileFactory.upload(vm.file, type).then(function (resp) {
            vm.file = [];
            if(type === vm.typeFile.STEP) {
              vm.stepModel.resource = resp.data;
              vm.stepModel.resourceId = resp.data.fileId;
              vm.isAddStepFile = false;
            } else if(type === vm.typeFile.SHOOTING) {
              vm.shootingModel.resource = resp.data;
              vm.shootingModel.resourceId = resp.data.fileId;
              vm.isAddFile = true;
            }
          });
        }
      }

      /**
       * Remove file uploaded
       * @param type
       */
      function removeFile(type) {
        if(type === vm.typeFile.STEP) {
          vm.stepModel.resource = null;
        } else {
          vm.shootingModel.resource = null;
        }
      }

      /**
       * Add new step
       */
      function addStep() {
        vm.stepModel.resourceId = vm.stepModel.resource ? vm.stepModel.resource.fileId : null;
        stepFactory.addNewStep(vm.stepModel).then(function (resp) {
          vm.shootingModel.steps.push(resp.data);
          vm.formAddStep.$setPristine();
          vm.stepModel = angular.copy(vm.stepModelBak);
        });
      }

      /**
       * Update a step
       */
      function updateStep() {
        vm.stepModel.resourceId = vm.stepModel.resource ? vm.stepModel.resource.fileId : null;
        stepFactory.updateStep(vm.stepModel).then(function (resp) {
          vm.shootingModel.steps[_.findIndex(vm.steps, function (step) {
            return step.id === resp.data.id;
          })] = resp.data;
          vm.formAddStep.$setPristine();
          vm.stepModel = angular.copy(vm.stepModelBak);
          vm.stepEditing = false;
        });
      }

      /**
       * Add or update a step
       */
      function addOrUpdateStep() {
        if(vm.stepEditing) {
          updateStep();
        }
        else {
          addStep();
        }
      }

      /**
       * Remove a step
       * @param step
       */
      function removeStep(step) {
        stepFactory.removeStep(step.id).then(function () {
          _.remove(vm.shootingModel.steps, step);
        });
      }

      /**
       * set model to save shooting
       */
      function setShootingModel() {
        var putModel = {
          id: vm.shootingModel.id,
          status: vm.shootingModel.status.id,
          resourceId: vm.shootingModel.resource ? vm.shootingModel.resource.fileId : 0,
          troubleId: vm.shootingModel.trouble.id,
          isActive: vm.shootingModel.isActive
        };
        return putModel;
      }

      /**
       * Approve a shooting
       */
      function approve() {
        shootingFactory.approveShooting(vm.shootingModel.id).then(function (resp) {
          close(resp.data);

          if(vm.troubleshootModel.canApproveIssue || resp.data.adminCanApproveIssue) {
            issueFactory.approve(trouble.issueApproveId).then(function (issueResp) {
              var paramIssue = {
                id: issueResp.data.id,
                ownerId: issueResp.data.requestByUserId,
                ownerName: issueResp.data.requestByUserName,
                message: issueResp.data.title
              };
              signalRFactory.issueHub.approveMessage(paramIssue);
            });           
          }

          var param = {
            id: resp.data.trouble.id,
            ownerId: resp.data.createdBy.id,
            ownerName: resp.data.createdBy.userName,
            message: resp.data.trouble.title
          };
          signalRFactory.shootingHub.approveMessage(param);

          if(resp.data.issuesClosed && resp.data.issuesClosed.length) {
            var paramCloseIssue = {
              id: resp.data.trouble.id,
              issueId: null,
              message: _.map(resp.data.issuesClosed, 'name').toString()
            };
            signalRFactory.issueHub.closeMessage(paramCloseIssue);
          }
        });
      }

       /**
       * reject a shooting
       */
      function reject() {
        var rejectModel = {
          rejectDescription: vm.rejectDescription
        };
        shootingFactory.rejectShooting(vm.shootingModel.id, rejectModel).then(function (resp) {
          vm.shootingModel.status = {
            id: 3,
            statusName: 'Rejected'
          };
          vm.shootingModel.rejectedDescription = rejectModel.rejectDescription;
          close(vm.shootingModel);

          var param = {
            id: resp.data.troubleId,
            ownerId: resp.data.ownerId,
            ownerName: resp.data.ownerName,
            message: resp.data.title
          };
          signalRFactory.shootingHub.rejectMessage(param);

          var paramProcess = {
            targetId: resp.data.troubleId,
            type: 2
          };
          signalRFactory.shootingHub.proccessMessage(paramProcess);
        });
      }


      /**
       * Request to approve a shooting
       */
      function requestToApprove() {
        shootingFactory.updateInfo(setShootingModel()).then(function (shootingResp) {
          shootingFactory.requestToApproveShooting(shootingResp.data.id).then(function (resp) {
            close(resp.data);

            var param = {
              id: resp.data.trouble.id,
              message: resp.data.trouble.title
            };
            signalRFactory.shootingHub.requestToApproveMessage(param);
          });
        });
      }

      /**
       * Complete add new shooting and close modal
       */
      function complete() {
        if(vm.shootingModel.status.id !== vm.shootingStatus.NEED_APPROVE && vm.shootingModel.status.id !== vm.shootingStatus.APPROVED) {
          shootingFactory.updateInfo(setShootingModel(), true).then(function (resp) {
            close(resp.data);
          });
        } else {
          close();
        }
      }

      /**
       * update info troubleshoot
       */
      function updateTroubleshoot() {
        vm.troubleshootModel.potentialCauseIds = data.potentialCauseId.toString();
        troubleshootFactory.updateInfo(vm.troubleshootModel).then(function (resp) {
          vm.troubleshootModel = resp.data;
        });
      }

      /**
       * delete shooting
       */
      function deleteShooting() {
        shootingFactory.removeItems(vm.shootingModel.id).then(function () {
          vm.shootingModel = null;
          close();
        });
      }

      /**
       * set first screen for user to choose add file or add step
       */
      function setFirstScreen() {
		if(vm.shootingModel.steps.length) {
			vm.isAddStep = true;
		} else if(vm.shootingModel.resource) {
			vm.isAddFile = true;
		} else {
			vm.isAddStep = false;
			vm.isAddFile = false;
		}
      }

      vm.permission = userContext.getPermissions();
      vm.currentUser = $rootScope.currentUserInfo;
      vm.shootingStatus = angular.fromJson(shootingStatus);
      vm.roleList = angular.fromJson(role);
      vm.troubleshootModel = angular.copy(data.troubleshootModel);
      vm.shootingModel = angular.copy(data.shootingModel);
      vm.typeFile = angular.fromJson(typeFile);
      vm.stepEditing = false;

      vm.stepModelBak = {
        stepContent: '',
        resourceId: 0,
        shootingId: vm.shootingModel.id
      };
      vm.stepModel = angular.copy(vm.stepModelBak);

      vm.uploadFile = uploadFile;
      vm.removeFile = removeFile;
      vm.addOrUpdateStep = addOrUpdateStep;
      vm.removeStep = removeStep;
      vm.approve = approve;
      vm.reject = reject;
      vm.requestToApprove = requestToApprove;
      vm.setFirstScreen = setFirstScreen;
      vm.complete = complete;
      vm.updateTroubleshoot = updateTroubleshoot;
      vm.deleteShooting = deleteShooting;
      vm.close = close;

      vm.getSrc = fileFactory.getSrc;
      vm.getFileExtension = fileFactory.getFileExtension;
      vm.getFileType = fileFactory.getFileType;

      setFirstScreen();


    }];
  return controller;
});
