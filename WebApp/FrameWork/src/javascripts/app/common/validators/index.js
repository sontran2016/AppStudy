define(function(require) {
  'use strict';
  var angular = require('angular');

  var module = angular.module('common.validators',
    [
      require('./cardNumber'),
      require('./compareTo'),
      require('./dateRange'),
      require('./money'),
      require('./number'),
      require('./httpUrl'),
      require('./greaterThan'),
      require('./ngMatch')
    ]);
  return module.name;
});
