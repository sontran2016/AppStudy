define(function (require) {
  'use strict';
  var angular = require('angular'),
    list = angular.fromJson(require('text!./../resources/area/list.json'));
  var module = angular.module('common.services.area', []);
  module.factory('areaFactory', [
    '$q',
    '$http',
    'appConstant',
    function ($q,
              $http,
              appConstant) {
      
      var services = {};
      /**
       * Load area list from server
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

        return $http.get(appConstant.domain + '/api/areas', {
          params: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            keyword: keyword,
            keySort: keySort,
            orderDescending: orderDescending,
            isActive: params.isActive
          }
        });
      }

      /**
       * Load area list from server
       * @returns {*}
       */
      function getAll() {
        return $http.get(appConstant.domain + '/api/areas', {
          params: {
            keySort: 'name',
            orderDescending: false,
            isActive: true
          }
        });
      }

      /**
       * Add new area
       * @param model
       * @returns {HttpPromise}
       */
      function addNew(model) {
        return $http.post(appConstant.domain + '/api/areas', model, {
          message: "MESSAGES.ADDED_SUCCESSFUL"
        });
      }

      /**
       * Update area information
       * @param model
       * @returns {HttpPromise}
       */
      function updateInfo(model) {
        return $http.put(appConstant.domain + '/api/areas/' + model.id, model, {
          message: "MESSAGES.UPDATED_SUCCESSFUL"
        });
      }

      /**
       * Get area details
       * @param id
       * @returns {HttpPromise}
       */
      function getDetails(id) {
        return $http.get(appConstant.domain + '/api/areas/' + id);
      }

      /**
       * Remove items
       * @param ids
       * @returns {HttpPromise}
       */
      function removeItems(ids) {
        return $http.delete(appConstant.domain + '/api/areas', {
          params: {
            ids: ids
          },
          message: "MESSAGES.DEACTIVATE_SUCCESSFUL"
        });
      }

      /**
       * get common areas
       * @returns {HttpPromise}
       */
      function getCommonAreas() {
        return $http.get(appConstant.domain + '/api/common/areas', {});
      }

      /**
       * get list users of area
       * @param model
       * @returns {HttpPromise}
       */
      function getUsersOfArea(model) {
        return $http.post(appConstant.domain + '/api/areas/users', model);
      }

      // Declare methods
      services.getList = getList;
      services.getAll = getAll;
      services.addNew = addNew;
      services.updateInfo = updateInfo;
      services.getDetails = getDetails;
      services.removeItems = removeItems;
      services.getCommonAreas = getCommonAreas;
      services.getUsersOfArea = getUsersOfArea;

      return services;
    }
  ]);
  return module.name;
});
