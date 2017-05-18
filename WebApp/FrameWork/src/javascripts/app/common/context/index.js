define(function (require){
  'use strict';
  var angular = require('angular');

  var module = angular.module('common.context', [
    require('./user')
  ]);
  return module.name;
});