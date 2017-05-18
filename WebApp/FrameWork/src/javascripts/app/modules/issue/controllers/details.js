define(function (require) {
  'use strict';
  var angular = require('angular'),
    moment = require('moment'),
    issueStatus = require('text!app/common/resources/issue/detail_status.json'),
    role = require('text!app/common/resources/user/role.json'),
    shootingStatus = require('text!app/common/resources/troubleshoot/status.json'),
    _ = require('lodash');

  var controller = [
    '$scope',
    '$state',
    '$q',
    'appConstant',
    'issueFactory',
    'data',
    'userContext',
    '$rootScope',
    '$uibModal',
    'signalRFactory',
    'notifications',
    'troubleshootFactory',
    'shootingFactory',
    function ($scope,
              $state,
              $q,
              appConstant,
              issueFactory,
              data,
              userContext,
              $rootScope,
              $uibModal,
              signalRFactory,
              notifications,
              troubleshootFactory,
              shootingFactory) {

      var vm = this;

      /**
       * Approve issue
       */
      function approve() {
        issueFactory.approve(vm.detailsData.id).then(function (resp) {
          vm.detailsData.status = resp.data.status;

          var param = {
            id: resp.data.id,
            ownerId: resp.data.requestByUserId,
            ownerName: resp.data.requestByUserName,
            message: resp.data.title
          };
          signalRFactory.issueHub.approveMessage(param);
        });
      }

      /**
       * open modal to reject issue
       */
      function openRejectModal() {
        var modalInstance = $uibModal.open({
          templateUrl: 'issue/templates/modal/rejectIssue.html',
          controller: 'RejectIssueController',
          controllerAs: 'vm',
          backdrop: 'static',
          size: 'lg',
          resolve: {
            issueModel: vm.detailsData
          }
        });

        modalInstance.result.then(function(resp) {
          vm.detailsData.status = resp.status;
          vm.detailsData.rejectedReason = resp.rejectedReason;
        });
      }

      /**
       * Close issue
       */
      function close() {
        issueFactory.close(vm.detailsData.id).then(function (resp) {
          vm.detailsData.status = resp.data.status;

          var param = {
            issueId: resp.data.id,
            message: resp.data.title
          };
          signalRFactory.issueHub.closeMessage(param);

          var paramProcess = {
            targetId: resp.data.id,
            type: 7
          };
          signalRFactory.issueHub.proccessMessage(paramProcess);
        });
      }

      /**
       * Send request to approve an issue
       */
      function requestToApprove() {
        issueFactory.requestApprove(vm.detailsData.id).then(function (resp) {
          vm.detailsData.status = resp.data.status;

          var paramRequest = {
            id: resp.data.id,
            message: resp.data.title
          };
          signalRFactory.issueHub.requestToApproveMessage(paramRequest);
        });
      }

      /**
       * Get list suggest issue
       */
      function getListIssueSuggest() {
        issueFactory.getListIssueSuggest(vm.detailsData.id).then(function (resp) {
          vm.suggestIssueList = resp.data;

          _.forEach(vm.suggestIssueList, function (obj) {
            obj.selected = false;
          });
        });
      }

      function getIssueDetail(issueId) {
        var deferred = $q.defer();
        issueFactory.getDetails(issueId).then(function (resp) {
          deferred.resolve(resp.data);
        });
        return deferred.promise;
      }

      /**
       * open modal to view detail of a suggest issue
       */
      function viewIssueDetail(issue) {
        getIssueDetail(issue.id).then(function (resp) {
          var modalInstance = $uibModal.open({
            templateUrl: 'issue/templates/modal/issueDetail.html',
            controller: 'SuggestIssueDetailController',
            controllerAs: 'vm',
            backdrop: 'static',
            size: 'lg',
            resolve: {
              issueModel: resp
            }
          });
        });
      }

      /**
       * Select a suggested issue in list
       */
      function selectSuggestIssue(issue, index) {
        _.forEach(vm.suggestIssueList, function (obj) {
          obj.selected = false;
        });
        vm.suggestIssueList[index].selected = true;
        vm.selectedIssue = issue;
      }

      /**
       * Assign current issue to a suggested issue
       */
      function assignIssue() {
        issueFactory.assignIssue(vm.detailsData.id, vm.selectedIssue.id).then(function () {
          $state.go('app.issueDetails', {id: vm.selectedIssue.id});
        });
      }

      function getConfirmAssign() {
        var selectedIssueTitle = vm.selectedIssue ? vm.selectedIssue.title : '';
        return 'Are you sure you want to assign issue "' + vm.detailsData.title + '"" to issue "' + selectedIssueTitle + '"';
      }

      function getShooting(trouble) {
        var deferred = $q.defer();
        troubleshootFactory.getDetails(trouble.id).then(function (resp) {
          if(resp.data.shootings && resp.data.shootings.length) {
            deferred.resolve(resp.data.shootings[resp.data.shootings.length - 1]);
          } else {
            var shootingModel = {
              troubleId: trouble.id,
              isActive: true,
              resourceId: '',
              version: ''
            };
            shootingFactory.addNew(shootingModel, false).then(function (shootingResp) {
              deferred.resolve(shootingResp.data);
            });
          }
        });
        return deferred.promise;
      }

      function viewTroubleshoot(potentialCause, e) {
        e.preventDefault();
        e.stopPropagation();

        getShooting(potentialCause.trouble).then(function (resp) {
          var modalInstance = $uibModal.open({
            templateUrl: 'issue/templates/modal/viewShooting.html',
            controller: 'ViewShootingController',
            controllerAs: 'vm',
            backdrop: 'static',
            size: 'lg',
            resolve: {
              data: {
                troubleshootModel: potentialCause.trouble,
                shootingModel: resp,
                canAction: false,
                potentialCauseId: potentialCause.id
              }
            }
          });

          modalInstance.result.then(function(resp) {
            if(resp.troubleshootModel.isActive === false) {
              vm.detailsData.potentialCauses[_.findIndex(vm.detailsData.potentialCauses, function (item) {
                    return item.id === potentialCause.id;
                  })].trouble = null;
            } else {
              vm.detailsData.potentialCauses[_.findIndex(vm.detailsData.potentialCauses, function (item) {
                    return item.id === potentialCause.id;
                  })].trouble = resp.troubleshootModel;
              
              if(resp.shootingModel && resp.shootingModel.status.id === vm.shootingStatus.APPROVED) {
                vm.detailsData.potentialCauses[_.findIndex(vm.detailsData.potentialCauses, function (item) {
                    return item.id === potentialCause.id;
                  })].trouble.isHaveShootingApproved = true;
              }

              vm.detailsData.potentialCauses[_.findIndex(vm.detailsData.potentialCauses, function (item) {
                    return item.id === potentialCause.id;
                  })].trouble.shootings === null ? [] : vm.detailsData.potentialCauses[_.findIndex(vm.detailsData.potentialCauses, function (item) {
                    return item.id === potentialCause.id;
                  })].trouble.shootings[0] = resp.shootingModel ? resp.shootingModel : null;

              if(!resp.shootingModel) {
                vm.detailsData.potentialCauses[_.findIndex(vm.detailsData.potentialCauses, function (item) {
                    return item.id === potentialCause.id;
                  })].trouble.shootings === null ? [] : vm.detailsData.potentialCauses[_.findIndex(vm.detailsData.potentialCauses, function (item) {
                    return item.id === potentialCause.id;
                  })].trouble.shootings = null;
              }

              vm.detailsData.potentialCauses[_.findIndex(vm.detailsData.potentialCauses, function (item) {
                  return item.id === potentialCause.id;
                })].trouble.shootings === null ? [] : vm.detailsData.potentialCauses[_.findIndex(vm.detailsData.potentialCauses, function (item) {
                  return item.id === potentialCause.id;
                })].trouble.shootings[0] = resp.shootingModel ? resp.shootingModel : null;

              if(!resp.shootingModel) {
                vm.detailsData.potentialCauses[_.findIndex(vm.detailsData.potentialCauses, function (item) {
                  return item.id === potentialCause.id;
                })].trouble.shootings === null ? [] : vm.detailsData.potentialCauses[_.findIndex(vm.detailsData.potentialCauses, function (item) {
                  return item.id === potentialCause.id;
                })].trouble.shootings = null;
              }

              if(resp.shootingModel && resp.shootingModel.status.id === vm.shootingStatus.REJECTED) {
                vm.detailsData.potentialCauses[_.findIndex(vm.detailsData.potentialCauses, function (item) {
                  return item.id === potentialCause.id;
                })].trouble.shootings[0].status.id = vm.shootingStatus.CREATED;
                vm.detailsData.potentialCauses[_.findIndex(vm.detailsData.potentialCauses, function (item) {
                  return item.id === potentialCause.id;
                })].trouble.shootings[0].steps = [];
                vm.detailsData.potentialCauses[_.findIndex(vm.detailsData.potentialCauses, function (item) {
                  return item.id === potentialCause.id;
                })].trouble.shootings[0].resource = null;
              }
            }
          });
        });
      }

      /* open modal to notify when this trouble is changed or deleted */
      notifications.onIssueCountChanged($scope, function (args) {
        if(args.data.TargetId === vm.detailsData.id) {
          var modalInstance = $uibModal.open({
            templateUrl: 'common/templates/notifyChanged.html',
            controller: 'NotifyChangedIssueController',
            controllerAs: 'vm',
            backdrop: 'static',
            keyboard: false,
            windowClass: 'notify-modal',
            size: 'lg',
            resolve: {
              type: function () {
                return 'issue';
              }
            }
          });
        }
      });
      
      vm.detailsData = data;
      vm.detailsData.timestamp = moment(vm.detailsData.timestamp).format('DD/MM/YYYY hh:mm A');
      vm.statusConfig = angular.fromJson(issueStatus);
      vm.shootingStatus = angular.fromJson(shootingStatus);
      vm.roleList = angular.fromJson(role);
      vm.permission = userContext.getPermissions();
      vm.currentUser = $rootScope.currentUserInfo;

      _.forEach(vm.detailsData.potentialCauses, function (obj) {
        obj.showLog = false;
      });

      vm.approve = approve;
      vm.openRejectModal = openRejectModal;
      vm.close = close;
      vm.requestToApprove = requestToApprove;
      vm.viewTroubleshoot = viewTroubleshoot;
      vm.selectSuggestIssue = selectSuggestIssue;
      vm.assignIssue = assignIssue;
      vm.getConfirmAssign = getConfirmAssign;
      vm.viewIssueDetail = viewIssueDetail;

      getListIssueSuggest();

    }];
  return controller;
});
