define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    '$state',
    'commonFactory',
    'signalRFactory',
    'moment',
    'notifications',
    function ($state,
              commonFactory,
              signalRFactory,
              moment,
              notifications) {

      var vm = this;

      /**
       * get list all notifications
       */
      function getNotificationList(page) {
        var model = {
          keyword: vm.keyword,
          skip: page ? (page - 1) * 10 : 0,
          take: vm.pageSize,
          searchType: 1,
          fromDate: vm.clearOption.fromDate ? moment(vm.clearOption.fromDate).format('MM/DD/YYYY') : '',
          toDate: vm.clearOption.toDate ? moment(vm.clearOption.toDate).format('MM/DD/YYYY') : ''
        };

        commonFactory.getNotificationList(model).then(function (resp) {
          if(!page) {
            vm.page = 1;
          }
          vm.notifications = resp.data.notifications;
          vm.totalCount = resp.data.count;
          vm.numPages = Math.ceil(vm.totalCount / vm.pageSize);
        });
      }

      /**
       * view detail of a troubleshoot notification
       * @param item
       */
      function viewDetail(item) {
        var param = {
          targetId: item.targetId,
          type: item.type
        };
        signalRFactory.shootingHub.proccessMessage(param);
        $state.go('app.troubleshootDetails', {id: item.targetId});
      }

      /**
       * reset toDate value when change fromDate value
       */
      function setToDate() {
        if(vm.clearOption.toDate < vm.clearOption.fromDate) {
          vm.clearOption.toDate = '';
        }
        getNotificationList();
      }

      /**
       * clear issue notification
       */
      function clearNotification() {
        var param = {
          mode: 1,
          type: Number(vm.clearOption.type),
          isAll: false,
          fromDate: vm.clearOption.fromDate ? moment(vm.clearOption.fromDate).format('MM/DD/YYYY') : '',
          toDate: vm.clearOption.toDate ? moment(vm.clearOption.toDate).format('MM/DD/YYYY') : ''
        };
        commonFactory.clearNotification(param).then(function () {
          vm.page = 1;
          getNotificationList();

          notifications.troubleshootCountChanged({
            data: {}
          });
        });
      }

      vm.pageSize = 10;
      vm.page = 1;
      vm.isCollapsed = true;
      vm.today = new Date();
      vm.today.setHours(0);
      vm.today.setMinutes(0);
      vm.today.setSeconds(0);
      vm.clearOption = {
        type: 0,
        fromDate: '',
        toDate: ''
      };

      vm.getNotificationList = getNotificationList;
      vm.viewDetail = viewDetail;
      vm.clearNotification = clearNotification;
      vm.setToDate = setToDate;

      getNotificationList();

    }];
  return controller;
});
