define(function (require) {
  'use strict';
  var angular = require('angular'),
    _ = require('lodash');
  var module = angular.module('common.services.symptom', []);

  module.factory('symptomFactory', [
    '$q',
    '$http',
    'appConstant',
    function ($q,
              $http,
              appConstant) {
      var services = {};

      /**
       * Load symptom list from server
       * @param params
       * @param keyword
       * @returns {*}
       */
      function getSymptomList(params) {
        var sortKey = params.orderBy()[0],
          keySort = sortKey.slice(1, sortKey.length),
          orderDescending = sortKey ? /^\-/.test(sortKey) : false,
          pageIndex = (params.page() - 1),
          pageSize = params.count(),
          areaId = params.areaId || null,
          lineId = params.lineId || null,
          machineId = params.machineId || null,
          componentId = params.componentId || null,
          keyword = params.keyword;

        return $http.get(appConstant.domain + '/api/symptoms', {
          params: {
            keySort: keySort,
            orderDescending: orderDescending,
            keyword: keyword,
            pageIndex: pageIndex,
            pageSize: pageSize,
            libraryId: componentId ? componentId : (machineId ? machineId : (lineId ? lineId : (areaId ? areaId : null))),
            libraryType: componentId ? 4 : (machineId ? 3 : (lineId ? 2 : (areaId ? 1 : 0))),
            isActive: params.isActive
          }
        });
      }

      /**
       * Remove items
       * @param ids
       * @returns {HttpPromise}
       */
      function removeItems(ids) {
        return $http.delete(appConstant.domain + '/api/symptoms', {
          params: {
            ids: ids
          },
          message: "MESSAGES.DEACTIVATE_SUCCESSFUL"
        });
      }

      /**
       * Add new symptom
       * @param model
       * @returns {HttpPromise}
       */
      function addNew(model) {
        var postModel = angular.copy(model);
        postModel.areaIds = _.isArray(postModel.areaIds) ? _.map(postModel.areaIds, 'id').toString() : postModel.areaIds;
        postModel.lineIds = _.isArray(postModel.lineIds) ? _.map(postModel.lineIds, 'id').toString() : postModel.lineIds;
        postModel.machineIds = _.isArray(postModel.machineIds) ? _.map(postModel.machineIds, 'id').toString() : postModel.machineIds;
        postModel.componentIds = _.isArray(postModel.componentIds) ? _.map(postModel.componentIds, 'id').toString() : postModel.componentIds;

        return $http.post(appConstant.domain + '/api/symptoms', postModel, {
          message: "MESSAGES.ADDED_SYMPTOM_SUCCESSFUL"
        });
      }

      /**
       * Get symptom details
       * @param id
       * @returns {HttpPromise}
       */
      function getDetails(id) {
        return $http.get(appConstant.domain + '/api/symptoms/' + id);
      }

      /**
       * Update symptom information
       * @param model
       * @returns {HttpPromise}
       */
      function updateInfo(model) {
        var putModel = angular.copy(model);
        return $http.put(appConstant.domain + '/api/symptoms/' + putModel.id, putModel, {
          message: "MESSAGES.UPDATED_SYMPTOM_SUCCESSFUL"
        });
      }

      /**
       * Update symptom description
       * @param model
       * @returns {HttpPromise}
       */
      function updateDescription(model) {
        var putModel = angular.copy(model);
        return $http.put(appConstant.domain + '/api/symptoms/' + putModel.id + '/description', putModel, {
          message: "MESSAGES.UPDATED_SYMPTOM_SUCCESSFUL"
        });
      }

      /**
       * get list users of symptom
       * @param model
       * @returns {HttpPromise}
       */
      function getUsersOfSymptom(model) {
        return $http.post(appConstant.domain + '/api/symptoms/users', model);
      }

      // Declare methods
      services.getSymptomList = getSymptomList;
      services.removeItems = removeItems;
      services.addNew = addNew;
      services.getDetails = getDetails;
      services.updateInfo = updateInfo;
      services.updateDescription = updateDescription;
      services.getUsersOfSymptom = getUsersOfSymptom;

      return services;
    }
  ]);
  return module.name;
});
