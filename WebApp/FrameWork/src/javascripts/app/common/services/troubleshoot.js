define(function (require) {
  'use strict';
  var angular = require('angular'),
    _ = require('lodash');
  var module = angular.module('common.services.troubleshoot', []);

  module.factory('troubleshootFactory', [
    '$q',
    '$http',
    'appConstant',
    'fileFactory',
    function ($q,
              $http,
              appConstant,
              fileFactory) {
      var services = {};

      /**
       * Load trouble shoot list from server
       * @param params
       * @param keyword
       * @returns {*}
       */
      function getTroubleshootList(params) {
        var sortKey = params ? params.orderBy()[0] : null,
          keySort = sortKey ? sortKey.slice(1, sortKey.length) : null,
          orderDescending = sortKey ? /^\-/.test(sortKey) : false,
          pageIndex = params ? (params.page() - 1) : 0,
          pageSize = params ? params.count() : 10,
          areaId = params ? params.areaId : null,
          lineId = params ? params.lineId : null,
          potentialCauseId = params ? params.potentialCauseId : null,
          symptomId = params ? params.symptomId : null,
          listStatus = params && params.listStatus ? params.listStatus.toString() : null,
          isOnlyMe = params ? params.isOnlyMe : false,
          isAllApproved = params ? params.isAllApproved : false,
          isActive = params ? params.isActive : null,
          keyword = params ? params.keyword : null
        return $http.get(appConstant.domain + '/api/troubles', {
          params: {
            keySort: keySort,
            orderDescending: orderDescending,
            keyword: keyword,
            pageIndex: pageIndex,
            pageSize: pageSize,
            areaId: areaId,
            lineId: lineId,
            potentialCauseIds: potentialCauseId,
            symptomId: symptomId,
            listStatus: listStatus,
            isOnlyMe: isOnlyMe,
            isAllApproved: isAllApproved,
            isActive: isActive
          }
        });
      }

      /**
       * get all troubleshoot not paging
       * @param potentialCauseId
       * @returns {HttpPromise}
       */
      function getAllTroubleshoot(potentialCauseId) {
        return $http.get(appConstant.domain + '/api/troubles', {
          params: {
            potentialCauseId: potentialCauseId,
            isActive: true
          }
        });
      }

      /**
       * get troubles total count
       * @returns {HttpPromise}
       */
      function getTroubleshootCount() {
        return $http.get(appConstant.domain + '/api/troubles/count');
      }

      /**
       * Remove items
       * @param ids
       * @returns {HttpPromise}
       */
      function removeItems(ids) {
        return $http.delete(appConstant.domain + '/api/troubles', {
          params: {
            ids: ids
          },
          message: "MESSAGES.DEACTIVATE_SUCCESSFUL"
        });
      }

      /**
       * delete inactive items
       * @param ids
       * @returns {HttpPromise}
       */
      function deleteInactiveItems(ids) {
        return $http.delete(appConstant.domain + '/api/troubles/delete', {
          params: {
            ids: ids
          },
          message: "MESSAGES.DELETED_TROUBLE_SUCCESSFUL"
        });
      }

      /**
       * Add new troubleshoot
       * @param model
       * @returns {HttpPromise}
       */
      function addNew(model) {
        var postModel = angular.copy(model);
        postModel.tagIds = postModel.tagIds ? postModel.tagIds.toString() : '';
        postModel.resourceIds = postModel.resourceIds ? postModel.resourceIds.toString() : '';
        postModel.potentialCauseIds = postModel.potentialCauseIds ? postModel.potentialCauseIds.toString() : '';

        return $http.post(appConstant.domain + '/api/troubles', postModel, {
          message: "MESSAGES.ADDED_TROUBLE_SUCCESSFUL"
        });
      }

      /**
       * Add new troubleshoot for issue
       * @param model
       * @returns {HttpPromise}
       */
      function addTroubleshootForIssue(model) {
        var postModel = angular.copy(model);
        postModel.tagIds = postModel.tagIds.toString();
        postModel.resourceIds = postModel.resourceIds.toString();
        postModel.potentialCauseIds = postModel.potentialCauseIds.toString();

        return $http.post(appConstant.domain + '/api/troubles/troubleissue', postModel, {
          message: "MESSAGES.ADDED_TROUBLE_SUCCESSFUL"
        });
      }

      /**
       * Get troubleshoot details
       * @param id
       * @returns {HttpPromise}
       */
      function getDetails(id) {
        return $http.get(appConstant.domain + '/api/troubles/' + id);
      }


      /**
       * Update troubleshoot information
       * @param model
       * @returns {HttpPromise}
       */
      function updateInfo(model) {
        var putModel = angular.copy(model);
        putModel.tagIds = _.isArray(putModel.tagIds) ? putModel.tagIds.toString() : putModel.tagIds;
        putModel.resourceIds = _.isArray(putModel.resourceIds) ? putModel.resourceIds.toString() : putModel.resourceIds;

        return $http.put(appConstant.domain + '/api/troubles/' + putModel.id, putModel, {
          message: "MESSAGES.UPDATED_TROUBLE_SUCCESSFUL"
        });
      }

      /**
       * add comment for troubleshoot
       * @param troubleId
       * @param model
       * @returns {HttpPromise}
       */
      function addComment(troubleId, model) {
        return $http.put(appConstant.domain + '/api/troubles/' + troubleId + '/comment', model, {
          message: "MESSAGES.ADDED_SUCCESSFUL"
        });
      }

       /**
       * set rating for trouble
       * @param troubleId
       * @returns {HttpPromise}
       */
      function setRating(troubleId, model) {
        return $http.put(appConstant.domain + '/api/troubles/' + troubleId + '/rate', model, {
          message: "MESSAGES.RATING_SUCCESSFUL"
        });
      }

      /**
       * download shooting
       * @param id
       * @returns {*}
       */
      function downLoadShooting(id) {
        var url = appConstant.domain + '/api/common/download/' + id;
        return $http.post(url, {}, {
          responseType: 'arraybuffer'
        }).success(function(data, status, headers) {
          try {
            fileFactory.exportFiles(data, headers, url);
          } catch (ex) {

          }
        });
      }

      /**
       * get list favorite troubles
       * @returns {*}
       */
      function getListFavoriteTroubles() {
        return $http.get(appConstant.domain + '/api/troubles/favorite');
      }

      /**
       * add a trouble to my favorite list
       * @param id
       * @returns {*}
       */
      function addToFavorite(id) {
        return $http.put(appConstant.domain + '/api/troubles/favorite/' + id, null, {
          message: "MESSAGES.ADD_FAVORITE_SUCCESSFUL"
        });
      }

      /**
       * remove a troubleshoot from favorite list
       * @param id
       * @returns {*}
       */
      function removeFavorite(id) {
        return $http.put(appConstant.domain + '/api/troubles/removefavorite/' + id, null, {
          message: "MESSAGES.REMOVE_FAVORITE_SUCCESSFUL"
        });
      }

      // Declare methods
      services.getTroubleshootList = getTroubleshootList;
      services.getAllTroubleshoot = getAllTroubleshoot;
      services.getTroubleshootCount = getTroubleshootCount;
      services.removeItems = removeItems;
      services.deleteInactiveItems = deleteInactiveItems;
      services.addNew = addNew;
      services.addTroubleshootForIssue = addTroubleshootForIssue;
      services.getDetails = getDetails;
      services.updateInfo = updateInfo;
      services.addComment = addComment;
      services.setRating = setRating;
      services.downLoadShooting = downLoadShooting;
      services.getListFavoriteTroubles = getListFavoriteTroubles;
      services.addToFavorite = addToFavorite;
      services.removeFavorite = removeFavorite;

      return services;
    }
  ])
  ;
  return module.name;
})
;
