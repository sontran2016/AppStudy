

define(function (require) {
    'use strict';
    var angular = require('angular');
    var module = angular.module('common.services.opcgroup', []);

    module.factory('opcGroupFactory', ['$q','$http','$httpBackend','appConstant',
      function ($q,$http,$httpBackend,appConstant) {
          var services = {};
          /**
           * Get opc group list
           * @param params
           * @param keyword
           * @returns {*}
           */
          function getList() {
              return $http.get('http://localhost:8008/opc/group');
          }          
          // Declare methods
          services.getList = getList;
          return services;
      }
    ]);
    return module.name;
});
