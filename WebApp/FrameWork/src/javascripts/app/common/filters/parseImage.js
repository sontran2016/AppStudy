define(function (require) {
  'use strict';
  var angular = require('angular'),
    moment = require('moment');

  var module = angular.module('common.filters.parseImage', [])
    .filter('parseImage', [
      'appConstant',
      function (constant) {
        return function (url, isThumb) {
          if (url) {
            return url;
          } else if (!isThumb) {
            return 'img/avatars/default-avatar.png';
          } else {
            return null;
          }
        };
      }]);
  return module.name;
});

