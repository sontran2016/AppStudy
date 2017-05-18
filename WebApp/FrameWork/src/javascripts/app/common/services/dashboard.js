define(function (require) {
  'use strict';
  var angular = require('angular'),
    _ = require('lodash');
  var module = angular.module('common.services.dashboard', []);
  module.factory('dashboardFactory', [
    'appConstant',
    '$http',
    function (appConstant,
              $http) {
      var services = {};

      /**
       * get dashboard info
       * @returns {*}
       */
      function getDashboard() {
        return $http.get(appConstant.domain + '/api/common/dashboard');
      }

      services.getDashboard = getDashboard;

      return services;
    }]);
  return module.name;
});
