define(function(require) {
  'use strict';
  var angular = require('angular');
  var module = angular.module('common.filters.capitalize', [])
    .filter('capitalize', function() {
      return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
      };
    });
  return module.name;
});

