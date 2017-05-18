define(function (require){
  'use strict';
  var angular = require('angular');

  var module = angular.module('common.providers', [
    require('./setting')
  ]);
  return module.name;
});
