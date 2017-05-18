define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    '$scope',
    '$state',
    '$uibModalInstance',
    'shootingModel',
    'shootingFactory',
    'signalRFactory',
    '$uibModal',
    'notifications',
    function ($scope,
              $state,
              $uibModalInstance,
              shootingModel,
              shootingFactory,
              signalRFactory,
              $uibModal,
              notifications) {

      var vm = this;

      /**
       * reject a shooting
       */
      function reject() {
        shootingFactory.rejectShooting(vm.shootingModel.id, vm.rejectModel).then(function (resp) {
          $uibModalInstance.close(resp.data);

          shootingFactory.getDetails(resp.data.id).then(function (shooting) {
            var param = {
              id: shooting.data.trouble.id,
              ownerId: resp.data.ownerId,
              ownerName: resp.data.ownerName,
              message: resp.data.title
            };
            signalRFactory.shootingHub.rejectMessage(param);
          });
        });
      }

      /**
       * Close modal
       */
      function close() {
        $uibModalInstance.dismiss('cancel');
      }

      vm.shootingModel = angular.copy(shootingModel);

      vm.rejectModel = {
        rejectDescription: '',
      };

      vm.reject = reject;
      vm.close = close;

    }];
  return controller;
});
