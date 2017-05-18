define(function (require) {
  'use strict';
  var angular = require('angular');
  var module = angular.module('common.services.line', []);

  module.factory('lineFactory', [
    '$q',
    '$http',
    '$httpBackend',
    'appConstant',
    function ($q,
              $http,
              $httpBackend,
              appConstant) {
      var services = {};

      /**
       * Load line list from server
       * @param params
       * @param keyword
       * @returns {*}
       */
      function getList(params) {
        var sortKey = params.orderBy()[0],
          keySort = sortKey.slice(1, sortKey.length),
          orderDescending = sortKey ? /^\-/.test(sortKey) : false,
          pageIndex = (params.page() - 1),
          pageSize = params.count(),
          keyword = params.keyword;

        return $http.get(appConstant.domain + '/api/lines', {
          params: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            keyword: keyword,
            keySort: keySort,
            orderDescending: orderDescending,
            areaFilter: params.areaFilter,
            isActive: params.isActive
          }
        });
      }

      /**
       * Load line list from server
       * @returns {*}
       */
      function getAll() {
        return $http.get(appConstant.domain + '/api/lines', {
          params: {
            keySort: 'name',
            orderDescending: false,
            isActive: true
          }
        });
      }

      /**
       * Add new line
       * @param model
       * @returns {HttpPromise}
       */
      function addNew(model) {
        return $http.post(appConstant.domain + '/api/lines', model, {
          message: "MESSAGES.ADDED_SUCCESSFUL"
        });
      }

      /**
       *
       * @param id
       * @param model
       * @returns {HttpPromise}
       */
      function updateInfo(id, model) {
        return $http.put(appConstant.domain + '/api/lines/' + id, model, {
          message: "MESSAGES.UPDATED_SUCCESSFUL"
        });
      }

      /**
       * Get line details
       * @param id
       * @returns {HttpPromise}
       */
      function getDetails(id) {
        return $http.get(appConstant.domain + '/api/lines/' + id);
      }

      /**
       * Remove items
       * @param ids
       * @returns {HttpPromise}
       */
      function removeItems(ids) {
        return $http.delete(appConstant.domain + '/api/lines', {
          params: {
            ids: ids
          },
          message: "MESSAGES.DEACTIVATE_SUCCESSFUL"
        });
      }

      /**
       * get list users of line
       * @param model
       * @returns {HttpPromise}
       */
      function getUsersOfLine(model) {
        return $http.post(appConstant.domain + '/api/lines/users', model);
      }

      // Declare methods
      services.getList = getList;
      services.getAll = getAll;
      services.addNew = addNew;
      services.updateInfo = updateInfo;
      services.getDetails = getDetails;
      services.removeItems = removeItems;
      services.getUsersOfLine = getUsersOfLine;

      return services;
    }
  ]);
  return module.name;
});
