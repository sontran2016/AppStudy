define(function(require) {
  'use strict';
  var angular = require('angular');
  var module = angular.module('common.filters.startFrom', [])
    .filter('startFrom', [
    	function() {
      return function(input, start) {
        if(input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
      };
    }]);
  return module.name;
});

