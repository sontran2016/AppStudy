define(function (require) {
  'use strict';
  var angular = require('angular'),
    _ = require('lodash');
  var module = angular.module('common.services.shooting', []);

  module.factory('shootingFactory', [
    '$q',
    '$http',
    'appConstant',
    function ($q,
              $http,
              appConstant) {

      var services = {};

      /**
       * Load shooting list from server
       * @returns {*}
       */
      function getShootingList() {
        return $http.get(appConstant.domain + '/api/shootings');
      }

      /**
       * Remove items
       * @param ids
       * @returns {HttpPromise}
       */
      function removeItems(ids) {
        return $http.delete(appConstant.domain + '/api/shootings', {
          params: {
            ids: ids
          },
          message: "MESSAGES.DELETED_SUCCESSFUL"
        });
      }

      /**
       * Add new shooting
       * @param model
       * @returns {HttpPromise}
       */
      function addNew(model, isShowMessage) {
        return $http.post(appConstant.domain + '/api/shootings', model, {
          message: isShowMessage ? "MESSAGES.ADDED_SHOOTING_SUCCESSFUL" : null
        });
      }

      /**
       * Get shooting details
       * @param id
       * @returns {HttpPromise}
       */
      function getDetails(id) {
        return $http.get(appConstant.domain + '/api/shootings/' + id);
      }


      /**
       * Update shooting information
       * @param model
       * @returns {HttpPromise}
       */
      function updateInfo(model, isShowMessage) {
        var putModel = angular.copy(model);
        return $http.put(appConstant.domain + '/api/shootings/' + putModel.id, putModel, {
          message: isShowMessage ? "MESSAGES.UPDATED_SUCCESSFUL" : null
        });
      }


      /**
       * approve shooting
       * @param id
       * @returns {HttpPromise}
       */
      function approveShooting(id) {
        return $http.put(appConstant.domain + '/api/shootings/' + id + '/approve', {
          id: id
        }, {
          message: "MESSAGES.APPROVED_SHOOTING_SUCCESSFUL"
        });
      }


      /**
       * reject shooting
       * @param id
       * @returns {HttpPromise}
       */
      function rejectShooting(id, model) {
        return $http.put(appConstant.domain + '/api/shootings/' + id + '/reject', model, {
          id: id
        }, {
          message: "MESSAGES.REJECTED_SUCCESSFUL"
        });
      }

      /**
       * request to approve shooting
       * @param id
       * @returns {HttpPromise}
       */
      function requestToApproveShooting(id) {
        return $http.put(appConstant.domain + '/api/shootings/' + id + '/requestapprove', {id: id},
          {
            message: "MESSAGES.REQUESTED_SUCCESSFUL"
          });
      }

      services.getShootingList = getShootingList;
      services.getDetails = getDetails;
      services.addNew = addNew;
      services.updateInfo = updateInfo;
      services.removeItems = removeItems;
      services.approveShooting = approveShooting;
      services.rejectShooting = rejectShooting;
      services.requestToApproveShooting = requestToApproveShooting;

      return services;
      
    }
  ])
  ;
  return module.name;
});