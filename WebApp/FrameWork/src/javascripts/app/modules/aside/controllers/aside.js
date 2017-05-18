define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var moduleType = angular.fromJson(require('text!app/common/resources/common/moduleType.json'));
  var controller = [
    'appConstant',
    '$scope',
    '$state',
    'commonFactory',
    'issueFactory',
    'troubleshootFactory',
    'notifications',
    function (appConstant,
              $scope,
              $state,
              commonFactory,
              issueFactory,
              troubleshootFactory,
              notifications) {

      var vm = this;

      /**
       * get total count of issue list
       */
      function getIssueCount() {
        issueFactory.getIssueCount().then(function (resp) {
          vm.issueCount = resp.data.count;
        });
      }

      /**
       * get total count of troubleshoot list
       */
      function getTroubleshootCount() {
        troubleshootFactory.getTroubleshootCount().then(function (resp) {
          vm.troubleshootCount = resp.data.count;
        });
      }

      notifications.onTroubleCountChanged($scope, function (args) {
        getTroubleshootCount();
      });

      notifications.onIssueCountChanged($scope, function (args) {
        getIssueCount();
      });

      notifications.onLibraryChanged($scope, function (args) {
        getTroubleshootCount();
        getIssueCount();
      });

      vm.$state = $state;

      vm.scrollOptions = {
        theme: 'minimal-dark',
        scrollbarPosition: 'outside',
        axis: "y"
      };

      getIssueCount();
      getTroubleshootCount();

    }];
  return controller;
});
