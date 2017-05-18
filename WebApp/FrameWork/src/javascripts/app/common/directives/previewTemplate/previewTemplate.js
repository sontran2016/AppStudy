define(function(require) {
  'use strict';
  var angular = require('angular'),
    _ = require('lodash'),
    tpl = require('text!./templates/previewTemplate.html'),
    modalTpl = require('text!./templates/previewTemplate.modal.html'),
    modalCtrl = require('./controllers/previewTemplate.modal'),
    module;

  module = angular.module('common.directives.previewTemplate', []);

  module.run([
    '$templateCache',
    function($templateCache) {
      $templateCache.put('previewTemplate.html', tpl);
      $templateCache.put('previewTemplate.modal.html', modalTpl);
    }
  ]);

  module.controller('previewTemplateModalController', modalCtrl);

  module.directive('previewTemplate', [
    '$uibModal',
    function($uibModal) {

      /**
       * link function
       * @param scope
       * @param element
       * @param attrs
       */
      function link(scope, element, attrs) {
        element.bind('click', function(e) {
          e.preventDefault();
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'previewTemplate.modal.html',
            controller: 'previewTemplateModalController',
            controllerAs: 'vm',
            size: 'lg',
            windowClass: "preview-modal",
            resolve: {
              url: [function() {
                return scope.vm.url;
              }],
              fileName: [function() {
                return scope.vm.fileName;
              }]
            }
          });
        });

        scope.$on('$destroy', function() {
          element.unbind('click');
        });
      }
      return {
        restrict: 'E',
        templateUrl: 'previewTemplate.html',
        controller: [
          '$scope',
          '$sce',
          function($scope,
                  $sce) {
            var vm = this;

            vm.getSrc = function () {
              return $sce.trustAsResourceUrl(vm.url);
            };
          }
        ],
        controllerAs: 'vm',
        scope: {
          url: '=',
          fileName: '=',
          type: '='
        },
        bindToController: true, // because the scope is isolated
        link: link
      };

    }
  ]);
  return module.name;
});
