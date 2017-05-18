define(function (require) {
  'use strict';
  var angular = require('angular'),
    list = angular.fromJson(require('text!./../resources/machine/list.json'));

  var module = angular.module('common.services.machine', []);

  module.factory('machineFactory', [
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
       * Load machine list from server
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
          keyword = params.keyword;

        return $http.get(appConstant.domain + '/api/machines', {
          params: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            keyword: keyword,
            keySort: keySort,
            orderDescending: orderDescending,
            areaId: areaId,
            lineId: lineId,
            isActive: params.isActive
          }
        });
      }

      /**
       * Load machine list from server
       * @returns {*}
       */
      function getAll() {
        return $http.get(appConstant.domain + '/api/machines', {
          params: {
            keySort: 'name',
            orderDescending: false,
            isActive: true
          }
        });
      }

      /**
       * Add new machine
       * @param model
       * @returns {HttpPromise}
       */
      function addNew(model) {
        return $http.post(appConstant.domain + '/api/machines', model, {
          message: "MESSAGES.ADDED_SUCCESSFUL"
        });
      }

      /**
       * Update machine information
       * @param model
       * @returns {HttpPromise}
       */
      function updateInfo(model) {
        return $http.put(appConstant.domain + '/api/machines/' + model.id, model, {
          message: "MESSAGES.UPDATED_SUCCESSFUL"
        });
      }

      /**
       * Get machine details
       * @param id
       * @returns {HttpPromise}
       */
      function getDetails(id) {
        return $http.get(appConstant.domain + '/api/machines/' + id);
      }

      /**
       * removeItems
       * @param ids
       * @returns {HttpPromise}
       */
      function removeItems(ids) {
        return $http.delete(appConstant.domain + '/api/machines', {
          params: {
            ids: ids
          },
          message: "MESSAGES.DEACTIVATE_SUCCESSFUL"
        });
      }

      /**
       * getCommonMachines
       * @param lineId
       * @returns {HttpPromise}
       */
      function getCommonMachines(lineId) {
        return $http.get(appConstant.domain + '/api/common/machines?lineId=' + lineId, {});
      }

      /**
       * get list users of machine
       * @param model
       * @returns {HttpPromise}
       */
      function getUsersOfMachine(model) {
        return $http.post(appConstant.domain + '/api/machines/users', model);
      }

      // Declare methods
      services.getList = getList;
      services.getAll = getAll;
      services.addNew = addNew;
      services.updateInfo = updateInfo;
      services.getDetails = getDetails;
      services.removeItems = removeItems;
      services.getCommonMachines = getCommonMachines;
      services.getUsersOfMachine = getUsersOfMachine;

      return services;
    }
  ]);
  return module.name;
});
