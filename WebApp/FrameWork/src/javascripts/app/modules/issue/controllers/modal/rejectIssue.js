define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    '$state',
    '$translate',
    '$uibModalInstance',
    'issueModel',
    'issueFactory',
    'signalRFactory',
    function ($state,
              $translate,
              $uibModalInstance,
              issueModel,
              issueFactory,
              signalRFactory) {

      var vm = this;

      /**
       * reject an issue
       */
      function reject() {
        issueFactory.reject(vm.issueModel.id, vm.rejectModel).then(function (resp) {
          $uibModalInstance.close(resp.data);

          var param = {
            id: resp.data.id,
            ownerId: resp.data.requestByUserId,
            ownerName: resp.data.requestByUserName,
            message: resp.data.title
          };
          signalRFactory.issueHub.rejectMessage(param);
        });
      }

      /**
       * Close modal
       */
      function close() {
        $uibModalInstance.dismiss('cancel');
      }

      vm.issueModel = angular.copy(issueModel);

      vm.rejectModel = {
        rejectReason: '',
      };

      vm.reject = reject;
      vm.close = close;

    }];
  return controller;
});
