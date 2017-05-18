define(function (require) {
  'use strict';
  var angular = require('angular'),
    moment = require('moment');

  var module = angular.module('common.filters.parseDateTime', [])
    .filter('parseDateTime', [
      'appConstant',
      function (constant) {
        return function (date) {
          return moment(date).format(constant.app.dateTimeFormat);
        };
      }]);
  return module.name;
});

