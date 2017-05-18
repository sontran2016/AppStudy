define(function (require) {
  'use strict';

  var angular = require('angular');

  var module = angular.module('common.filters.newLines', [])
    .filter('newLines', function () {
      return function(text) {
        return text ? text.toString().replace(/\n/g, '<br/>') : '';
      };
    });

  return module.name;

});
