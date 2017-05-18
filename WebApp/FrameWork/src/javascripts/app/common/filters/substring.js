define(function(require) {
  'use strict';
  var angular = require('angular');
  var module = angular.module('common.filters.substring', [])
    .filter('substring', function() {
      return function(str, start, end) {
        return str.substring(start, end);
      };
    });
  return module.name;
});

