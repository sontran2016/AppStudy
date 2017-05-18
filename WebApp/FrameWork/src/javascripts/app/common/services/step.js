define(function (require) {
  'use strict';
  var angular = require('angular'),
    _ = require('lodash');
  var module = angular.module('common.services.step', []);

  module.factory('stepFactory', [
    '$q',
    '$http',
    'appConstant',
    function ($q,
              $http,
              appConstant) {
      var services = {};


      /**
       * Add new step
       * @param model
       * @returns {HttpPromise}
       */
      function addNewStep(model) {
        return $http.post(appConstant.domain + '/api/steps', model, {
          message: "MESSAGES.ADDED_SUCCESSFUL"
        });
      }

      /**
       * update step
       * @param model
       * @returns {HttpPromise}
       */
      function updateStep(model) {
        return $http.put(appConstant.domain + '/api/steps/' + model.id, model, {
          message: "MESSAGES.UPDATED_SUCCESSFUL"
        });
      }

      /**
       * remove solution
       * @param stepId
       * @returns {HttpPromise}
       */
      function removeStep(stepId) {
        return $http.delete(appConstant.domain + '/api/steps', {
          params: {
            ids: stepId
          },
          message: "MESSAGES.DELETED_SUCCESSFUL"
        });
      }

      services.addNewStep = addNewStep;
      services.updateStep = updateStep;
      services.removeStep = removeStep;

      return services;
    }
  ])
  ;
  return module.name;
})
;
