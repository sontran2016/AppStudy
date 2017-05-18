define(function (require){
  'use strict';
  var angular = require('angular');

  var module = angular.module('common.index', [
    require('./providers/index'),
    require('./context/index'),
    require('./services/index'),
    require('./filters/index'),
    require('./validators/index'),
    require('./directives/index')
  ]);
  return module.name;
});
