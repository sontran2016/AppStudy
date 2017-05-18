define(function(require) {
  'use strict';
  var angular = require('angular');
  var module = angular.module('common.filters.prefixNumber', [])
    .filter('prefixNumber', [function() {
      return function(number) {
        return number >=0 && number <= 9 ? '0' + number : number;
      };
    }]);
  return module.name;
});

