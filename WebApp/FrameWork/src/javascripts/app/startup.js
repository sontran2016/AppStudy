define(function (require){
  'use strict';

  var angular = require('angular');

  var app = angular.module('app.startup', []);

  app
    .run([
      '$templateCache',
      'userContext',
      '$rootScope',
      function ($templateCache,
                userContext,
                $rootScope){
        // Load Authentication data from local storage
        userContext.loadFromLocal();
      }
    ]);

  return app.name;
});