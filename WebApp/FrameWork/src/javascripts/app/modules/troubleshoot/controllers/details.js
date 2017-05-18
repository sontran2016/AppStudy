define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var role = require('text!app/common/resources/user/role.json');
  var shootingStatus = require('text!app/common/resources/troubleshoot/status.json');
  var controller = [
    'shootingFactory',
    'troubleshootFactory',
    'troubleshootModel',
    '$translate',
    '$uibModal',
    'userContext',
    '$rootScope',
    'appConstant',
    '$scope',
    '$state',
    '$stateParams',
    'moment',
    'notifications',
    'utilFactory',
    'fileFactory',
    'signalRFactory',
    'issueFactory',
    function (shootingFactory,
              troubleshootFactory,
              troubleshootModel,
              $translate,
              $uibModal,
              userContext,
              $rootScope,
              appConstant,
              $scope,
              $state,
              $stateParams,
              moment,
              notifications,
              utilFactory,
              fileFactory,
              signalRFactory,
              issueFactory) {

      var vm = this;

      /**
       * open modal to add new shooting
       */
      function addNewShooting() {
        var shootingModel = {
          troubleId: vm.detailsData.id,
          isActive: true,
          resourceId: '',
          version: ''
        };
        shootingFactory.addNew(shootingModel, true).then(function (resp) {
          var modalInstance = $uibModal.open({
            templateUrl: 'troubleshoot/templates/modal/newShooting.html',
            controller: 'NewShootingController',
            controllerAs: 'vm',
            backdrop: 'static',
            keyboard  : false,
            size: 'lg',
            resolve: {
              shootingModel: resp.data,
              trouble: vm.detailsData
            }
          });

          modalInstance.result.then(function(shootingResp) {
            vm.detailsData.shootings = vm.detailsData.shootings || [];
            vm.detailsData.shootings.unshift(shootingResp);
            vm.shootingTable = vm.shootingTable || {data: []};
            vm.shootingTable.data.unshift(shootingResp);
            if(shootingResp.status.id !== vm.shootingStatus.APPROVED) {
              vm.myShooting = shootingResp;
            }
            if(shootingResp.status.id === vm.shootingStatus.NEED_APPROVE && vm.detailsData.createdBy.id === vm.currentUser.id) {
              $state.go('app.troubleshoot');
            }
            if(shootingResp.status.id === vm.shootingStatus.APPROVED) {
              vm.detailsData.status.id = 2;
              vm.detailsData.status.name = 'Confirmed';
              vm.detailsData.canEdit = false;
              
              vm.shootingTable.data[_.findIndex(vm.shootingTable.data, function (item) {
                return item.id === shootingResp.id;
              })] = shootingResp;

              _.forEach(vm.shootingTable.data, function (item) {
                if(item.id !== shootingResp.id) {
                  item.isActive = false;
                }
              });
              vm.myShooting = null;
              vm.approvedShooting.unshift(shootingResp);
            }
          });
        });
      }

      /**
       * open modal to view and update my shooting
       */
      function viewMyShooting(listData, shootingData) {
        var modalInstance = $uibModal.open({
          templateUrl: 'troubleshoot/templates/modal/myShooting.html',
          controller: 'MyShootingController',
          controllerAs: 'vm',
          backdrop: 'static',
          keyboard  : false,
          size: 'lg',
          resolve: {
            data: {
              shootingModel: shootingData ? shootingData : vm.myShooting,
              trouble: vm.detailsData
            }
          }
        });

        modalInstance.result.then(function(shootingResp) {
          if(!shootingResp) {
            if(vm.shootingTable) {
              _.remove(vm.shootingTable.data, vm.shootingTable.data[_.findIndex(vm.shootingTable.data, function (item) {
                  return item.id === vm.myShooting.id;
                })]);
            }
            vm.myShooting = null;
          }
          else {
            if(shootingResp.status.id !== vm.shootingStatus.APPROVED) {
              vm.detailsData.status.id = 2;
              vm.detailsData.status.name = 'Confirmed';
              vm.detailsData.canEdit = false;

              vm.myShooting = shootingResp;
              if(listData && shootingData) {
                listData[_.findIndex(listData, function (row) {
                  return row.id === shootingResp.id;
                })] = shootingResp;
              }
            }
            if(shootingResp.status.id === vm.shootingStatus.NEED_APPROVE && vm.detailsData.createdBy.id === vm.currentUser.id) {
              $state.go('app.troubleshoot');
            }
            if(shootingResp.status.id === vm.shootingStatus.APPROVED) {
              vm.shootingTable.data[_.findIndex(vm.shootingTable.data, function (item) {
                return item.id === shootingResp.id;
              })] = shootingResp;

              _.forEach(vm.shootingTable.data, function (item) {
                if(item.id !== shootingResp.id) {
                  item.isActive = false;
                }
              });
              vm.myShooting = null;
            }
          }
        });
      }

      /**
       * send new comment
       */
      function sendComment() {
        troubleshootFactory.addComment(vm.detailsData.id, vm.commentModel).then(function (resp) {
          vm.comments = resp.data.comments;
          vm.formComment.$setPristine();
          vm.commentModel = angular.copy(vm.commentModelBak);

          var param = {
            id: vm.detailsData.id,
            ownerId: vm.currentUser.id,
            ownerName: vm.currentUser.userName,
            message: vm.detailsData.title
          };
          signalRFactory.shootingHub.addCommentMessage(param);
        });
      }

      /**
       * approve shooting
       * @param listData
       * @param shooting
       */
      function approveShooting(listData, shooting) {
        shootingFactory.approveShooting(shooting.id).then(function (resp) {
          vm.detailsData.status.id = 2;
          vm.detailsData.status.name = 'Confirmed';
          vm.detailsData.canEdit = false;

          listData[_.findIndex(listData, function (row) {
            return row.id === shooting.id;
          })] = resp.data;

          _.forEach(listData, function (item) {
            if(item.id !== resp.data.id) {
              item.isActive = false;
            }
          });

          if(vm.detailsData.canApproveIssue || resp.data.adminCanApproveIssue) {
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

          if(resp.data.issuesClosed && resp.data.issuesClosed.length) {
            var paramCloseIssue = {
              id: resp.data.trouble.id,
              issueId: null,
              message: _.map(resp.data.issuesClosed, 'name').toString()
            };
            signalRFactory.issueHub.closeMessage(paramCloseIssue);

            var paramProcess = {
              targetId: _.map(resp.data.issuesClosed, 'id').toString(),
              type: 7
            };
            signalRFactory.issueHub.proccessMessage(paramProcess);
          }
        });
      }

      /**
       * open modal to reject a shooting
       * @param listData
       * @param shooting
       */
      function openRejectModal(listData, shooting) {
        var modalInstance = $uibModal.open({
          templateUrl: 'troubleshoot/templates/modal/rejectShooting.html',
          controller: 'RejectShootingController',
          controllerAs: 'vm',
          backdrop: 'static',
          size: 'lg',
          resolve: {
            shootingModel: shooting
          }
        });

        modalInstance.result.then(function(resp) {
          listData[_.findIndex(listData, function (row) {
            return row.id === shooting.id;
          })].status.id = vm.shootingStatus.REJECTED;

          if(!vm.approvedShooting.length) {
            $state.go('app.troubleshoot');
          }
        });
      }

      /**
       * remove a shooting
       */
      function removeShooting(listData, shooting) {
        shootingFactory.removeItems(shooting.id).then(function () {
          if(shooting.createdBy.id === vm.currentUser.id) {
            vm.myShooting = null;
          }
           _.remove(listData, shooting);
        });
      }

      /**
       * set rating for trouble
       */
      function setRating() {
        if(vm.detailsData.rate !== 0) {
          var model = {
            numRate: vm.detailsData.rate
          };
          troubleshootFactory.setRating(vm.detailsData.id, model).then(function (resp) {
            vm.detailsData.rate = resp.data.rate;
            vm.detailsData.isRated = true;
          });
        }
      }

      /**
       * download shooting
       * @param id
       */
      function downLoad(id) {
        troubleshootFactory.downLoadShooting(id);
      }

      /**
       * add trouble to my favorite
       * @param id
       */
      function addToFavorite(id) {
        troubleshootFactory.addToFavorite(id).then(function () {
          vm.detailsData.isFavorited = true;
        });
      }

      function updateTroubleshoot() {
        var model = {
          "id": vm.detailsData.id,
          "title": vm.detailsData.title,
          "description": vm.detailsData.description,
          "isDDS": vm.detailsData.isDDS,
          "potentialCauseIds": _.map(vm.detailsData.potentialCauses, 'id').join(),
          "resourceIds": vm.detailsData.resourceIds,
          "tagIds": vm.detailsData.tagIds,
          "isActive": true
        };
        troubleshootFactory.updateInfo(model).then(function (resp) {
          vm.detailsData.isActive = true;
        });
      }

      function back() {
        if($stateParams.troubleId) {
          $state.go('app.issueDetails', {id: $stateParams.id});
        } else {
          $state.go('app.troubleshoot');
        }
      }

      /* reload page when receiving a troubleshoot notification */
      notifications.onTroubleshootCountChanged($scope, function (args) {
        if(vm.approvedShooting.length) {
          $state.reload();
        }
      });

      /* open modal to notify when this trouble is changed or deleted */
      notifications.onTroubleCountChanged($scope, function (args) {
        if(args.data.TargetId === vm.detailsData.id) {
          var modalInstance = $uibModal.open({
            templateUrl: 'common/templates/notifyChanged.html',
            controller: 'NotifyChangedTroubleshootController',
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

      vm.permission = userContext.getPermissions();
      vm.currentUser = $rootScope.currentUserInfo;
      vm.roleList = angular.fromJson(role);
      vm.shootingStatus = angular.fromJson(shootingStatus);

      vm.detailsData = troubleshootModel;
      vm.comments = angular.copy(vm.detailsData.comments);
      vm.myShooting = _.find(vm.detailsData.shootings, function (shooting) {
        return shooting.version === 0 && shooting.createdBy.id === vm.currentUser.id;
      });
      vm.approvedShooting = _.filter(vm.detailsData.shootings, function (shooting) {
        return shooting.version !== 0;
      });

      vm.needToApproveShooting = _.filter(vm.detailsData.shootings, function (shooting) {
        return shooting.status.id === vm.shootingStatus.NEED_APPROVE ||
              (shooting.status.id === vm.shootingStatus.CREATED && shooting.createdBy.id === vm.currentUser.id);
      });

      vm.commentModelBak = {
        comment: '',
        timestamp: moment().format(),
        imageUrl: '',
        userId: vm.currentUser.id
      };
      vm.commentModel = angular.copy(vm.commentModelBak);

      vm.scrollOptions = {
        theme: 'dark-thin',
        scrollbarPosition: 'outside',
        axis: "y"
      };

      vm.conf = {
        module: 'shooting',
        showHeading: false,
        rowClickable: false,
        listData: function () {
          return _.sortBy(_.filter(vm.detailsData.shootings, function (shooting) {
            return shooting.status.id === vm.shootingStatus.NEED_APPROVE || shooting.status.id === vm.shootingStatus.APPROVED ||
                  (shooting.status.id === vm.shootingStatus.CREATED && shooting.createdBy.id === vm.currentUser.id);
          }), function (obj) {
            return obj.updateOnDate;
          }).reverse();
        },
        optionalData: vm.detailsData.id,
        removeFn: function (listData, shooting) {
          return removeShooting(listData, shooting);
        },
        approveFn: function (listData, shooting) {
          return approveShooting(listData, shooting);
        },
        rejectFn: function (listData, shooting) {
          return openRejectModal(listData, shooting);
        },
        viewDetailModalFn: function (listData, shootingData) {
          return viewMyShooting(listData, shootingData);
        },
        addToFavoriteFn: function (id) {
          return addToFavorite(id);
        },
        sorting: {
          updateOnDate: 'desc'
        },
        cols: [
          {
            field: "version",
            title: $translate.instant('GENERAL.VERSION'),
            show: true,
            dataType: "versionShooting",
            width: "5%"
          },
          {
            field: "changedBy",
            title: $translate.instant('TROUBLESHOOT.APPROVED_REJECTED_BY'),
            show: true,
            dataType: "ownerName"
          },
          {
            field: "approvedDate",
            title: $translate.instant('TROUBLESHOOT.APPROVED_REJECTED_TIME'),
            show: true,
            dataType: "shootingDate"
          },
          {
            field: "createdBy",
            title: $translate.instant('GENERAL.LAST_UPDATED_BY'),
            show: true,
            dataType: "ownerName"
          },
          {
            field: "updateOnDate",
            title: $translate.instant('GENERAL.LAST_UPDATED_TIME'),
            show: true,
            dataType: "date"
          },
          {
            field: "action",
            title: $translate.instant('GENERAL.ACTION'),
            show: true,
            dataType: "shootingCommand",
            width: "5%"
          }
        ]
      };

      vm.confIssue = {
        module: 'issue_troubleshoot',
        showHeading: false,
        rowClickable: true,
        detailLink: 'app.troubleshootIssueDetail',
        listData: function () {
          return vm.detailsData.issues;
        },
        viewDetailFn: function (row) {
          $state.go('app.troubleshootIssueDetail', {id: vm.detailsData.id, issueId: row.id});
        },
        optionalData: vm.detailsData.id,
        sorting: {
          updateOnDate: 'desc'
        },
        cols: [
          {
            field: "title",
            title: $translate.instant('GENERAL.TITLE'),
            show: true,
            dataType: "text",
            width: "30%"
          },
          {
            field: "description",
            title: $translate.instant('GENERAL.DESCRIPTION'),
            show: true,
            dataType: "text"
          }
        ]
      };

      vm.addNewShooting = addNewShooting;
      vm.viewMyShooting = viewMyShooting;
      vm.sendComment = sendComment;
      vm.setRating = setRating;
      vm.downLoad = downLoad;
      vm.addToFavorite = addToFavorite;
      vm.updateTroubleshoot = updateTroubleshoot;
      vm.getFileExtension = fileFactory.getFileExtension;
      vm.getFileType = fileFactory.getFileType;
      vm.back = back;

      utilFactory.scrollTop();

    }];
  return controller;
});
