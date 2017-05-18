

define(function (require) {
    'use strict';
    var angular = require('angular');
    var module = angular.module('common.services.opctag', []);

    module.factory('opcTagFactory', ['$q','$http','$httpBackend','appConstant',
      function ($q,$http,$httpBackend,appConstant) {
          var services = {};
          /**
           * get opc tag list
           * @param params
           * @param keyword
           * @returns {*}
           */
          function getList() {
              return $http.get('http://localhost:8008/opc/tag');
          }          
          // Declare methods
          services.getList = getList;
          return services;
      }
    ]);
    return module.name;
});
