define(function (require) {
  'use strict';
  var angular = require('angular'),
    _ = require('lodash');
  var module = angular.module('common.services.tag', []);

  module.factory('tagFactory', [
    '$q',
    '$http',
    'userContext',
    'appConstant',
    function ($q,
              $http,
              userContext,
              appConstant) {
      var services = {};

      /**
       * Load tag list from server
       * @param params
       * @param keyword
       * @returns {*}
       */
      function getTagList(params) {
        var sortKey = params.orderBy()[0],
          keySort = sortKey.slice(1, sortKey.length),
          orderDescending = sortKey ? /^\-/.test(sortKey) : false,
          pageIndex = (params.page() - 1),
          pageSize = params.count(),
          keyword = params.keyword;

        return $http.get(appConstant.domain + '/api/tags', {
          params: {
            keySort: keySort,
            orderDescending: orderDescending,
            keyword: keyword,
            pageIndex: pageIndex,
            pageSize: pageSize,
            isActive: params.isActive
          }
        });
      }

      /**
      * Get all tags
      * @returns {HttpPromise}
      */
      function getAllTags() {
        return $http.get(appConstant.domain + '/api/tags', {
          params: {
            keySort: 'id',
            orderDescending: true,
            isActive: true
          }
        });
      }

      /**
       * Remove items
       * @param ids
       * @returns {HttpPromise}
       */
      function removeItems(ids) {
        return $http.delete(appConstant.domain + '/api/tags', {
          params: {
            ids: ids
          },
          message: "MESSAGES.DEACTIVATE_SUCCESSFUL"
        });
      }

      /**
       * Add new tag
       * @param model
       * @returns {HttpPromise}
       */
      function addNew(model) {
        return $http.post(appConstant.domain + '/api/tags', model, {
          message: "MESSAGES.ADDED_SUCCESSFUL"
        });
      }

      /**
       * Get tag details
       * @param id
       * @returns {HttpPromise}
       */
      function getDetails(id) {
        return $http.get(appConstant.domain + '/api/tags/' + id);
      }

      /**
       * Update tag information
       * @param model
       * @returns {HttpPromise}
       */
      function updateInfo(model) {
        return $http.put(appConstant.domain + '/api/tags/'+ model.tagId, model, {
          message: "MESSAGES.UPDATED_SUCCESSFUL"
        });
      }

      // Declare methods
      services.getTagList = getTagList;
      services.getAllTags = getAllTags;
      services.getDetails = getDetails;
      services.removeItems = removeItems;
      services.addNew = addNew;
      services.updateInfo = updateInfo;

      return services;
    }
  ]);
  return module.name;
});
