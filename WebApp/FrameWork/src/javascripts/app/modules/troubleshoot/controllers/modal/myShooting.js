define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var role = require('text!app/common/resources/user/role.json');
  var typeFile = require('text!app/common/resources/common/fileType.json');
  var shootingStatus = require('text!app/common/resources/troubleshoot/status.json');
  var controller = [
    '$state',
    '$translate',
    '$uibModalInstance',
    'userContext',
    '$rootScope',
    'data',
    'shootingFactory',
    'fileFactory',
    'stepFactory',
    'troubleshootFactory',
    'toaster',
    'signalRFactory',
    'issueFactory',
    function ($state,
              $translate,
              $uibModalInstance,
              userContext,
              $rootScope,
              data,
              shootingFactory,
              fileFactory,
              stepFactory,
              troubleshootFactory,
              toaster,
              signalRFactory,
              issueFactory) {

      var vm = this;

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
          vm.stepModel.resourceId = null;
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
          vm.steps.push(resp.data);
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
          vm.steps[_.findIndex(vm.steps, function (step) {
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
          _.remove(vm.steps, step);
        });
      }

      /**
       * set model to save shooting
       */
      function setShootingModel() {
        var putModel = {
          id: vm.shootingModel.id,
          status: vm.shootingModel.status.id,
          resourceId: vm.shootingModel.resourceId,
          troubleId: data.trouble.id,
          isActive: vm.shootingModel.isActive
        };
        return putModel;
      }

      /**
       * Approve a shooting
       */
      function approve() {
        shootingFactory.approveShooting(vm.shootingModel.id).then(function (resp) {
          $uibModalInstance.close(resp.data);

          if(data.trouble.canApproveIssue || resp.data.adminCanApproveIssue) {
            issueFactory.approve(resp.data.issuesClosed.id).then(function (issueResp) {
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

          var paramProcess = {
            targetId: resp.data.trouble.id,
            type: 2
          };
          signalRFactory.shootingHub.proccessMessage(paramProcess);

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
        shootingFactory.rejectShooting(vm.shootingModel.id).then(function (resp) {
          $uibModalInstance.close(resp.data);

          var param = {
            id: resp.data.trouble.id,
            ownerId: resp.data.ownerId,
            ownerName: resp.data.ownerName,
            message: resp.data.trouble.title
          };
          signalRFactory.shootingHub.rejectMessage(param);

          var paramProcess = {
            targetId: resp.data.trouble.id,
            type: 2
          };
          signalRFactory.shootingHub.proccessMessage(paramProcess);
        });
      }

      /**
       * save and approve a shooting
       */
      function saveAndApprove() {
        shootingFactory.updateInfo(setShootingModel()).then(function (shootingResp) {
          shootingFactory.approveShooting(shootingResp.data.id).then(function (resp) {
            $uibModalInstance.close(resp.data);

            if(data.trouble.canApproveIssue || shootingResp.data.adminCanApproveIssue) {
              issueFactory.approve(resp.data.issuesClosed.id).then(function (issueResp) {
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
          });
        });
      }

      /**
       * save and request to approve a shooting
       */
      function saveAndRequestToApprove() {
        shootingFactory.updateInfo(setShootingModel()).success(function (shootingResp) {
          shootingFactory.requestToApproveShooting(shootingResp.id).then(function (resp) {
            $uibModalInstance.close(resp.data);

            var param = {
              id: resp.data.trouble.id,
              message: resp.data.trouble.title
            };
            signalRFactory.shootingHub.requestToApproveMessage(param);
          });
        }).error(function () {
          $uibModalInstance.dismiss('cancel');
          $state.go('app.troubleshoot');
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

      /**
       * delete shooting
       */
      function deleteShooting() {
        shootingFactory.removeItems(vm.shootingModel.id).then(function () {
          $uibModalInstance.close();
        });
      }

      /**
       * save my shooting
       */
      function save() {
        if((vm.isAddFile || vm.isAddStep) && 
          (vm.shootingModel.status.id === vm.shootingStatus.CREATED || vm.shootingModel.status.id === vm.shootingStatus.REJECTED)) {
            shootingFactory.updateInfo(setShootingModel(), false).then(function (resp) {
              $uibModalInstance.close(resp.data);
            });
        } else {
          $uibModalInstance.dismiss('cancel');
        }
      }

      /**
       * set first screen for user to choose add file or add step
       */
      function setFirstScreen() {
        if(vm.shootingModel.resource) {
          vm.isAddFile = true;
        } else if(vm.steps.length) {
          vm.isAddStep = true;
        } else {
          vm.isAddFile = false;
          vm.isAddStep = false;
        }
      }

      vm.permission = userContext.getPermissions();
      vm.currentUser = $rootScope.currentUserInfo;
      vm.roleList = angular.fromJson(role);
      vm.typeFile = angular.fromJson(typeFile);
      vm.shootingStatus = angular.fromJson(shootingStatus);
      vm.shootingModel = angular.copy(data.shootingModel);
      vm.steps = angular.copy(vm.shootingModel.steps);
      vm.stepEditing = false;
      vm.showFullReason = false;

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
      vm.save = save;
      vm.approve = approve;
      vm.reject = reject;
      vm.saveAndApprove = saveAndApprove;
      vm.saveAndRequestToApprove = saveAndRequestToApprove;
      vm.setFirstScreen = setFirstScreen;
      vm.downLoad = downLoad;
      vm.deleteShooting = deleteShooting;

      vm.getSrc = fileFactory.getSrc;
      vm.getFileExtension = fileFactory.getFileExtension;
      vm.getFileType = fileFactory.getFileType;

      setFirstScreen();

    }];
  return controller;
});
