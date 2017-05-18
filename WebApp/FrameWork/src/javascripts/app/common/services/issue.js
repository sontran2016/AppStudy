define(function (require) {
  'use strict';
  var angular = require('angular'),
    _ = require('lodash');
  var module = angular.module('common.services.issue', []);

  module.factory('issueFactory', [
    '$q',
    '$http',
    'appConstant',
    function ($q,
              $http,
              appConstant) {
      var services = {};

      /**
       * Get issue List
       * @param params
       * @returns {HttpPromise}
       */
      function getIssueList(params) {
        var sortKey = params ? params.orderBy()[0] : null,
          keySort = sortKey ? sortKey.slice(1, sortKey.length) : null,
          orderDescending = sortKey ? /^\-/.test(sortKey) : false,
          pageIndex = params ? (params.page() - 1) : 0,
          pageSize = params ? params.count() : 10,
          areaId = params ? params.areaId : null,
          lineId = params ? params.lineId : null,
          machineId = params ? params.machineId : null,
          componentId = params ? params.componentId : null,
          symptomId = params ? params.symptomId : null,
          listStatus = params && params.listStatus ? params.listStatus.toString() : null,
          isOnlyMe = params ? params.isOnlyMe : false,
          notHaveTrouble = params ? params.notHaveTrouble : false,
          keyword = params ? params.keyword : null;
        return $http.get(appConstant.domain + '/api/issues', {
          params: {
            keySort: keySort,
            orderDescending: orderDescending,
            keyword: keyword,
            pageIndex: pageIndex,
            pageSize: pageSize,
            areaId: areaId,
            lineId: lineId,
            machineId: machineId,
            componentId: componentId,
            symptomId: symptomId,
            listStatus: listStatus,
            isOnlyMe: isOnlyMe,
            notHaveTrouble: notHaveTrouble
          }
        });
      }

      /**
       * Get issue total count
       * @returns {HttpPromise}
       */
      function getIssueCount() {
        return $http.get(appConstant.domain + '/api/issues/count');
      }

      /**
       * Remove items
       * @param ids
       * @returns {HttpPromise}
       */
      function removeItems(ids) {
        return $http.delete(appConstant.domain + '/api/issues', {
          params: {
            ids: ids
          },
          message: "MESSAGES.DEACTIVATE_SUCCESSFUL"
        });
      }

      /**
       * Add new area
       * @param model
       * @returns {HttpPromise}
       */
      function addNew(model) {
        return $http.post(appConstant.domain + '/api/issues', model, {
          message: "MESSAGES.ADDED_ISSUE_SUCCESSFUL"
        });
      }

      /**
       * Get area details
       * @param id
       * @returns {HttpPromise}
       */
      function getDetails(id) {
        return $http.get(appConstant.domain + '/api/issues/' + id);
      }

      /**
       * updateInfo
       * @param id
       * @param model
       * @returns {HttpPromise}
       */
      function updateInfo(id, model) {
        return $http.put(appConstant.domain + '/api/issues/' + id, model, {
          message: "MESSAGES.UPDATED_ISSUE_SUCCESSFUL"
        });
      }


      /**
       * approve issue
       * @param id
       * @returns {HttpPromise}
       */
      function approve(id) {
        return $http.put(appConstant.domain + '/api/issues/' + id + '/approve', null, {
          message: "MESSAGES.APPROVED_ISSUE_SUCCESSFUL"
        });
      }


      /**
       * reject issue
       * @param id
       * @returns {HttpPromise}
       */
      function reject(id, model) {
        return $http.put(appConstant.domain + '/api/issues/' + id + '/reject', model, {
          message: "MESSAGES.REJECTED_SUCCESSFUL"
        });
      }


      /**
       * close issue
       * @param id
       * @returns {HttpPromise}
       */
      function close(id) {
        return $http.put(appConstant.domain + '/api/issues/' + id + '/close', null, {
          message: "MESSAGES.CLOSED_SUCCESSFUL"
        });
      }

      /**
       * Request approve an issue
       * @param id
       * @returns {HttpPromise}
       */
      function requestApprove(id) {
        return $http.put(appConstant.domain + '/api/issues/' + id + '/requestapprove', null, {
          message: "MESSAGES.REQUESTED_SUCCESSFUL"
        });
      }

      /**
       * Get list issue suggest
       * @param issue Id
       * @returns {HttpPromise}
       */
      function getListIssueSuggest(issueId) {
        return $http.get(appConstant.domain + '/api/issues/' + issueId + '/suggest');
      }

      function assignIssue(issueId, issueParentId) {
        return $http.put(appConstant.domain + '/api/issues/' + issueId + '/assign/' + issueParentId, null, {
          message: "MESSAGES.ASSIGNED_ISSUE_SUCCESSFUL"
        });
      }

      services.getIssueList = getIssueList;
      services.getIssueCount = getIssueCount;
      services.removeItems = removeItems;
      services.addNew = addNew;
      services.getDetails = getDetails;
      services.updateInfo = updateInfo;
      services.approve = approve;
      services.reject = reject;
      services.close = close;
      services.requestApprove = requestApprove;
      services.getListIssueSuggest = getListIssueSuggest;
      services.assignIssue = assignIssue;

      return services;
    }
  ]);
  return module.name;
});
