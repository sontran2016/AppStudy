define(function (require) {
  'use strict';
  var angular = require('angular'),
    confirmDeleteTpl = require('text!./../templates/confirmDeleteSelected.html'),
    module;
  module = angular.module('common.directives.confirmDelete', []);
  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('common/templates/confirmDelete.html', confirmDeleteTpl);

    }]);

  module.controller('ConfirmDeleteBoxController', [
    '$uibModalInstance',
    function ($uibModalInstance) {
      var vm = this;

      /**
       * OK Button function
       */
      function ok() {
        $uibModalInstance.close();
      }

      /**
       * Cancel button function
       */
      function cancel() {
        $uibModalInstance.dismiss('cancel');
      }

      vm.ok = ok;
      vm.close = cancel;
    }]);

  module.factory('confirmDeleteBoxFactory', [
    '$uibModal',
    '$q',
    function ($uibModal,
              $q) {
      var services = {};

      /**
       * Show confirm box
       */
      function showConfirmBox() {
        var deferred = $q.defer();
        var modalInstance = $uibModal.open({
          templateUrl: 'common/templates/confirmDelete.html',
          controller: 'ConfirmDeleteBoxController',
          controllerAs: 'vm'
        });
        modalInstance.result.then(function () {
          deferred.resolve();
        });
        return deferred.promise;
      }

      services.showConfirmBox = showConfirmBox;

      return services;
    }
  ]);

  module.directive('confirmDelete', [
    '$uibModal',
    '$translate',
    function ($uibModal,
              $translate) {

      /**
       * confirm delete action controller
       * @param $uibModalInstance
       * @param action
       */
      function ConfirmDeleteCtrlFn($uibModalInstance, action) {
        var vm = this;

        /**
         * OK Button function
         */
        function ok() {
          $uibModalInstance.close();
        }

        /**
         * Cancel button function
         */
        function cancel() {
          $uibModalInstance.dismiss('cancel');
        }

        vm.ok = ok;
        vm.action = action;
        vm.close = cancel;
      }

      /**
       * Confirm delete link function
       * @param scope
       * @param elem
       * @param attrs
       */
      function confirmDeleteLinkFn(scope, elem, attrs) {
        /**
         * get action string
         * @returns {*|string}
         */
        function getAction() {
          return scope.action || $translate.instant('GENERAL.REMOVE_CONFIRM');
        }

        elem.on('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          var modalInstance = $uibModal.open({
            templateUrl: 'common/templates/confirmDelete.html',
            controller: ['$uibModalInstance',
              'action',
              ConfirmDeleteCtrlFn
            ],
            controllerAs: 'vm',
            resolve: {
              action: getAction
            }
          });
          modalInstance.result.then(function () {
            if (scope.onOk) {
              scope.onOk();
            }
          });
        });
      }

      return {
        restrict: 'A',
        scope: {
          onOk: '&',
          action: '@'
        },
        link: confirmDeleteLinkFn
      };
    }]);
  return module.name;
});
