define(function(require) {
  'use strict';
  var angular = require('angular'),
    _ = require('lodash'),
    module;

  module = angular.module('common.services.permission', []);

  module.factory('permissionFactory', [
      'appConstant',
      '$rootScope',
      'userContext',
      function(constant,
               $rootScope,
               userContext) {
        var service = {};

        /**
         * check permission
         * @param p
         * @returns {boolean}
         */
        service.checkPermission = function(p) {
          var permissions = userContext.getPermissions();

          //return true;
          if(permissions) {
            return permissions === p;
          }
          else {
            return false;
          }
        };

        return service;
      }
    ]
  );

  return module.name;
});
