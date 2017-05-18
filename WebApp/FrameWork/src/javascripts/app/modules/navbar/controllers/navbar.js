define(function (require) {
  'use strict';
  var angular = require('angular');
  var moduleType = require('text!app/common/resources/common/moduleType.json');
  var controller = [
    'accountFactory',
    '$state',
    '$scope',
    '$rootScope',
    '$window',
    'userContext',
    'commonFactory',
    'shootingFactory',
    '$uibModal',
    'notifications',
    'signalRFactory',
    function (accountFactory,
              $state,
              $scope,
              $rootScope,
              $window,
              userContext,
              commonFactory,
              shootingFactory,
              $uibModal,
              notifications,
              signalRFactory) {
      var vm = this;

      /**
       * sign out
       */
      function signout() {
        accountFactory.logout().then(function (resp) {
          //disconnect signal r
          signalRFactory.stop();

          $state.transitionTo('page.signin');
        }, function(){
          $state.transitionTo('page.signin');
        });
      }

      /**
       * get user profile
       */
      function getUserProfile() {
        accountFactory.getUserInfo().then(function (resp) {
          if(vm.info.userData.firstName !== resp.data.firstName || vm.info.userData.lastName !== resp.data.lastName) {
            vm.info.userData.firstName = resp.data.firstName;
            vm.info.userData.lastName = resp.data.lastName;
          }
        });
      }

      /**
       * get list top notifications
       */
      function getNotificationTopList(typeNotification) {
        var model = {
          searchType: typeNotification,
          topQuantity: 5
        };

        commonFactory.getNotificationTopList(model).then(function (resp) {
          if(typeNotification === vm.moduleType.TROUBLESHOOT) {
            vm.troubleNotifications = resp.data.notifications;
          } else if(typeNotification === vm.moduleType.ISSUE) {
            vm.issueNotifications = resp.data.notifications;
          } else {
            vm.libraryNotifications = resp.data.notifications;
          }
        });
      }

      /**
       * get total count of notifications
       */
      function getTotalCountNotification(typeNotification) {
        commonFactory.getTotalCount(typeNotification).then(function (resp) {
          if(typeNotification === vm.moduleType.TROUBLESHOOT) {
            vm.totalTroubleCount = resp.data.count;
          } else if(typeNotification === vm.moduleType.ISSUE) {
            vm.totalIssueCount = resp.data.count;
          } else {
            vm.totalLibraryCount = resp.data.count;
          }
        });
      }

      /**
       * open modal to import master data or import troubleshoots
       * @param dataType
       */
      function importData(dataType) {
        var modalInstance = $uibModal.open({
          templateUrl: 'navbar/templates/modal/import.html',
          controller: 'ImportController',
          controllerAs: 'vm',
          backdrop: 'static',
          size: 'lg',
          resolve: {
            data: {
              dataType: dataType
            }
          }
        });
      }

      /**
       * get total count of notifications
       * @param item
       * @param moduleType - 1: troubleshoot / 2: issue
       */
      function viewDetail(item, moduleType) {
        var param = {};
        if(moduleType === vm.moduleType.TROUBLESHOOT) {
          vm.showTroubleNotification = false;
          $state.go('app.troubleshootDetails', {id: item.targetId});

          param = {
            targetId: item.targetId,
            type: item.type
          };
          signalRFactory.shootingHub.proccessMessage(param);

        } else if(moduleType === vm.moduleType.ISSUE) {
          vm.showIssueNotification = false;
          $state.go('app.issueDetails', {id: item.targetId});

          param = {
            targetId: item.targetId,
            type: item.type
          };
          signalRFactory.issueHub.proccessMessage(param);

        } else {
          param = {
            targetId: item.targetId,
            type: item.type
          };
          signalRFactory.libraryHub.proccessMessage(param);
        }
      }

      notifications.onTroubleshootCountChanged($scope, function (args) {
        getNotificationTopList(vm.moduleType.TROUBLESHOOT);
        getTotalCountNotification(vm.moduleType.TROUBLESHOOT);

      });

      notifications.onIssueCountChanged($scope, function (args) {
        getNotificationTopList(vm.moduleType.ISSUE);
        getTotalCountNotification(vm.moduleType.ISSUE);
      });

      notifications.onLibraryChanged($scope, function (args) {
        getNotificationTopList(vm.moduleType.LIBRARY);
        getTotalCountNotification(vm.moduleType.LIBRARY);
      });

      $window.onclick = function (e) {
        if(e.target.className !== 'fa fa-exclamation-triangle notification-icon pointer' && e.target.className !== 'badge pointer' && 
            e.target.className !== 'badge trouble-badge pointer' && e.target.className !== 'fa fa-question-circle notification-icon pointer' && 
            e.target.className !== 'fa fa-bell-o notification-icon pointer') {
          $('.notification-panel').hide();
          vm.showIssueNotification = false;
          vm.showTroubleNotification = false;
          vm.showImportNotification = false;
          $scope.$apply();
        }
      };

      vm.info = userContext.authentication();
      vm.moduleType = angular.fromJson(moduleType);
      vm.showIssueNotification = false;
      vm.showTroubleNotification = false;
      vm.showImportNotification = false;

      vm.signout = signout;
      vm.viewDetail = viewDetail;
      vm.importData = importData;

      getUserProfile();
      getNotificationTopList(vm.moduleType.ISSUE);
      getNotificationTopList(vm.moduleType.TROUBLESHOOT);
      getNotificationTopList(vm.moduleType.LIBRARY);
      getTotalCountNotification(vm.moduleType.ISSUE);
      getTotalCountNotification(vm.moduleType.TROUBLESHOOT);
      getTotalCountNotification(vm.moduleType.LIBRARY);

    }];
  return controller;
});
