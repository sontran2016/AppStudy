define(function(require) {
  'use strict';
  var angular = require('angular');
  var module = angular.module('common.filters.imageUrl', [])
    .filter('imageUrl', ['utilFactory',
    	function(utilFactory) {
      return function(value) {
        return utilFactory.getImageUrl(value.substring(value.indexOf('/')));
      };
    }]);
  return module.name;
});

