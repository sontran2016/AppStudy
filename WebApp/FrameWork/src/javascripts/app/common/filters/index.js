define(function (require) {
  'use strict';
  var angular = require('angular');

  var module = angular.module('common.filters', [
    require('./cut'),
    require('./fileName'),
    require('./newLines'),
    require('./fileTypeExt'),
    require('./number'),
    require('./substring'),
    require('./cacheBuster'),
    require('./parseDateTime'),
    require('./parseImage'),
    require('./capitalize'),
    require('./trustedHtml'),
    require('./imageUrl'),
    require('./startFrom'),
    require('./prefixNumber')
  ]);
  return module.name;
});
