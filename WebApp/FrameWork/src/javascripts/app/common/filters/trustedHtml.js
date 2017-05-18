define(function (require) {
  'use strict';

  var angular = require('angular');

  var module = angular.module('common.filters.trustedHtml', [])
    .filter('trustedHtml', ['$sce', function ($sce) {
      return function(text) {
        return $sce.trustAsHtml(text);
      };
    }]);

  return module.name;

});
