define(function (require) {
  'use strict';
  var angular = require('angular'),
    _ = require('lodash');
  var module = angular.module('common.services.user', []);

  module.factory('userFactory', [
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
       * Load user list from server
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
          role = params.role ? params.role : null,
          areaIds = params.areaIds,
          keyword = params.keyword
        return $http.get(appConstant.domain + '/api/accounts', {
          params: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            keyword: keyword,
            keySort: keySort,
            orderDescending: orderDescending,
            areaIds: areaIds,
            role: role,
            isActive: params.isActive
          }
        });
      }

      /**
       * Add new user
       * @param model
       * @returns {HttpPromise}
       */
      function addNew(model) {
        return $http.post(appConstant.domain + '/api/accounts', model, {
          message: "MESSAGES.ADDED_SUCCESSFUL"
        });
      }

      /**
       *
       * @param id
       * @param model
       * @returns {HttpPromise}
       */
      function updateInfo(id,model) {
        return $http.put(appConstant.domain + '/api/accounts/profile/' + id, model, {
          message: "MESSAGES.UPDATED_SUCCESSFUL"
        });
      }

      /**
       * Get user details
       * @param id
       * @returns {HttpPromise}
       */
      function getDetails(id) {
        return $http.get(appConstant.domain + '/api/accounts/account/' + id);
      }

      /**
       * Remove items
       * @param ids
       * @returns {HttpPromise}
       */
      function removeItems(ids) {
        return $http.delete(appConstant.domain + '/api/accounts', {
          params: {
            ids: ids
          },
          message: "MESSAGES.DEACTIVATE_SUCCESSFUL"
        });
      }

      // Declare methods
      services.getList = getList;
      services.addNew = addNew;
      services.updateInfo = updateInfo;
      services.getDetails = getDetails;
      services.removeItems = removeItems;

      return services;
    }
  ]);
  return module.name;
});
