define(function (require) {
  'use strict';
  var angular = require('angular');
  var module = angular.module('common.filters.cacheBuster', [])
    .filter('cacheBuster', [
      'appConstant',
      function (constant) {
        return function (url) {
          var d = new Date();
          url = url.replace(/[?|&]_v=\d+/, '');
          url += url.indexOf('?') === -1 ? '?' : '&';
          url += '_v=' + constant.version;

          return url;
        };
      }]);
  return module.name;
});

