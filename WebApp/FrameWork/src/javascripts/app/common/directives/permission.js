define(function (require) {
  'use strict';
  var angular = require('angular'),
    _ = require('lodash'),
    module;
  module = angular.module('common.directives.permission', []);
  module.directive('permission', [
    'accountFactory',
    'notifications',
    '$rootScope',
    function (accountFactory,
              notifications,
              $rootScope) {
      return function (scope, element, attrs) {

        /**
         * check permission
         */
        function checkPermission() {
          if (attrs.permission.indexOf(',') > -1) {
            var permissions = attrs.permission.split(',');
            var flag = accountFactory.checkRole(permissions);
            if (flag) {
              element.show();
            } else {
              element.hide();
            }
          }
          else {
            if (!accountFactory.checkRole([attrs.permission])) {
              element.hide();
            } else {
              element.show();
            }
          }
        }

        notifications.onLibraryChanged(scope, checkPermission);

        checkPermission();
      };
    }]);
  return module.name;
});
