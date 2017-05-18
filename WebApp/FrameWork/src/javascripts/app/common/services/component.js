define(function (require) {
  'use strict';
  var angular = require('angular');
  //list = angular.fromJson(require('text!./../resources/component/list.json'));

  var module = angular.module('common.services.component', []);

  module.factory('componentFactory', [
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
       * Load component list from server
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
          areaId = params.areaId || null,
          lineId = params.lineId || null,
          machineId = params.machineId || null,
          keyword = params.keyword;

        return $http.get(appConstant.domain + '/api/components', {
          params: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            keyword: keyword,
            keySort: keySort,
            orderDescending: orderDescending,
            areaId: areaId,
            lineId: lineId,
            machineId: machineId,
            isActive: params.isActive
          }
        });
      }

      /**
       * Load component list from server
       * @returns {*}
       */
      function getAll() {
        return $http.get(appConstant.domain + '/api/components', {
          params: {
            keySort: 'name',
            orderDescending: false,
            isActive: true
          }
        });
      }

      /**
       * Add new component
       * @param model
       * @returns {HttpPromise}
       */
      function addNew(model) {
        return $http.post(appConstant.domain + '/api/components', model, {
          message: "MESSAGES.ADDED_SUCCESSFUL"
        });
      }

      /**
       * Update component information
       * @param model
       * @returns {HttpPromise}
       */
      function updateInfo(model) {
        return $http.put(appConstant.domain + '/api/components/' + model.id, model, {
          message: "MESSAGES.UPDATED_SUCCESSFUL"
        });
      }

      /**
       * Get component details
       * @param id
       * @returns {HttpPromise}
       */
      function getDetails(id) {
        return $http.get(appConstant.domain + '/api/components/' + id);
      }

      /**
       * Remove items
       * @param ids
       * @returns {HttpPromise}
       */
      function removeItems(ids) {
        return $http.delete(appConstant.domain + '/api/components', {
          params: {
            ids: ids
          },
          message: "MESSAGES.DEACTIVATE_SUCCESSFUL"
        });
      }

      /**
       * getCommonComponents
       * @param machineId
       * @returns {HttpPromise}
       */
      function getCommonComponents(machineId) {
        return $http.get(appConstant.domain + '/api/common/components?machineId=' + machineId, {});
      }

      /**
       * get list users of component
       * @param model
       * @returns {HttpPromise}
       */
      function getUsersOfComponent(model) {
        return $http.post(appConstant.domain + '/api/components/users', model);
      }

      // Declare methods
      services.getList = getList;
      services.getAll = getAll;
      services.addNew = addNew;
      services.updateInfo = updateInfo;
      services.getDetails = getDetails;
      services.removeItems = removeItems;
      services.getCommonComponents = getCommonComponents;
      services.getUsersOfComponent = getUsersOfComponent;

      return services;
    }
  ]);
  return module.name;
});
