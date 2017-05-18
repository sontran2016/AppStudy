define(function(require) {
  'use strict';

  var angular = require('angular');

  var module = angular.module('common.filters.fileTypeExt', [])
    .filter('fileTypeExt', function() {
      return function(ipt) {
        if(/(ifc|json)/i.test(ipt)) {
          return 'img/icon/file/file.png';
        } else {
          return 'img/icon/file/' + ipt + '.png';
        }
      };
    });
  return module.name;
});
