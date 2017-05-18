define(function (require) {
  'use strict';
  var angular = require('angular'),
    _ = require('lodash');
  var module = angular.module('common.services.potentialCause', []);

  module.factory('potentialCauseFactory', [
    '$q',
    '$http',
    'appConstant',
    'userContext',
    function ($q,
      $http,
      appConstant,
      userContext) {
      var services = {};

      /**
       * Load potential cause list from server
       * @param params
       * @param keyword
       * @returns {*}
       */
      function getPotentialCauseList(params) {
        var sortKey = params.orderBy()[0],
          keySort = sortKey.slice(1, sortKey.length),
          orderDescending = sortKey ? /^\-/.test(sortKey) : false,
          pageIndex = (params.page() - 1),
          pageSize = params.count(),
          areaId = params.areaId || null,
          lineId = params.lineId || null,
          machineId = params.machineId || null,
          componentId = params.componentId || null,
          symptomId = params.symptomId || null,
          keyword = params.keyword;

        return $http.get(appConstant.domain + '/api/potentialcauses', {
          params: {
            keySort: keySort,
            orderDescending: orderDescending,
            keyword: keyword,
            pageIndex: pageIndex,
            pageSize: pageSize,
            libraryId: componentId ? componentId : (machineId ? machineId : (lineId ? lineId : (areaId ? areaId : null))),
            libraryType: componentId ? 4 : (machineId ? 3 : (lineId ? 2 : (areaId ? 1 : 0))),
            symptomId: symptomId,
            isActive: params.isActive
          }
        });
      }

      /**
       * get list potential cause by symptom ids
       * @param symptomIds
       * @returns {*}
       */
      function getPotentialCausesBySymptom(params) {
        return $http.get(appConstant.domain + '/api/potentialcauses/bysymptom', {
          params: {
            symptomIds: params.symptomIds
          }
        });
      }

      /**
       * Remove items
       * @param ids
       * @returns {HttpPromise}
       */
      function removeItems(ids) {
        return $http.delete(appConstant.domain + '/api/potentialcauses', {
          params: {
            ids: ids
          },
          message: "MESSAGES.DELETED_POTENTIAL_CAUSE_SUCCESSFUL"
        });
      }

      /**
       * Add new potential cause
       * @param model
       * @returns {HttpPromise}
       */
      function addNew(model) {
        return $http.post(appConstant.domain + '/api/potentialcauses', model, {
          message: "MESSAGES.ADDED_POTENTIAL_CAUSE_SUCCESSFUL"
        });
      }

      /**
       * Get potential cause details
       * @param id
       * @returns {HttpPromise}
       */
      function getDetails(id) {
        return $http.get(appConstant.domain + '/api/potentialcauses/' + id);
      }

      /**
       * Get all symptoms
       * @returns {HttpPromise}
       */
      function getAllSymptoms() {
        var areas = userContext.authentication().userData.areas,
          areaIds = _.map(areas, 'id');

        areaIds = areaIds.length ? areaIds.toString() : "all";

        return $http.get(appConstant.domain + '/api/symptoms', {
          params: {
            keySort: 'id',
            orderDescending: true,
            areaIds: areaIds
          }
        });
      }

      /**
       * Get all potential causes
       * @param symptomId
       * @returns {HttpPromise}
       */
      function getAll(symptomId) {
        return $http.get(appConstant.domain + '/api/potentialcauses', {
          params: {
            keySort: 'id',
            orderDescending: true,
            symptomId: symptomId,
            isActive: true
          }
        });
      }

      /**
       * Update area information
       * @param model
       * @returns {HttpPromise}
       */
      function updateInfo(model) {
        var apiCall = '/api/potentialcauses/' + model.id;
        if (model.isUpdateDescription)
          apiCall = '/api/potentialcauses/' + model.id + '/description';
        return $http.put(appConstant.domain + apiCall, model, {
          message: "MESSAGES.UPDATED_POTENTIAL_CAUSE_SUCCESSFUL"
        });
      }

      /**
       * get list users of potential cause
       * @param model
       * @returns {HttpPromise}
       */
      function getUsersOfPotentialCause(model) {
        return $http.post(appConstant.domain + '/api/potentialcauses/users', model);
      }

      // Declare methods
      services.getPotentialCauseList = getPotentialCauseList;
      services.getPotentialCausesBySymptom = getPotentialCausesBySymptom;
      services.removeItems = removeItems;
      services.addNew = addNew;
      services.getDetails = getDetails;
      services.updateInfo = updateInfo;
      services.getAllSymptoms = getAllSymptoms;
      services.getAll = getAll;
      services.getUsersOfPotentialCause = getUsersOfPotentialCause;

      return services;
    }
  ]);
  return module.name;
});
