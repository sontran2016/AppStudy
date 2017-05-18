define(function (require) {
  'use strict';
  var angular = require('angular'),
    _ = require('lodash');
  var module = angular.module('common.services.common', []);
  module.factory('commonFactory', [
    '$http',
    'appConstant',
    function ($http,
              appConstant) {
      var services = {};

      /**
       * updateItem
       *
       * @param isCheckAllItems
       * @param item
       * @param itemsChecked
       * @param rows
       * @returns {*}
       */
      function updateItem(isCheckAllItems, item, itemsChecked, rows) {
        if (!item.selector) {
          _.remove(itemsChecked, function (o) {
            return o === item.id;
          });

          if (isCheckAllItems) {
            itemsChecked = [];
            _.each(rows, function (o, key) {
              if (o.selector) {
                itemsChecked.push(o.id);
              }
            });
          }

        } else {
          itemsChecked.push(item.id);
        }

        return itemsChecked;
      }

      /**
       * checkAllItems
       * @param list
       */
      function checkAllItems(list) {
        _.forEach(list, function (value, key) {
          value.selector = true;
        });
      }

      /**
       * removeAllItems
       * @param list
       */
      function removeAllItems(list) {
        _.forEach(list, function (value, key) {
          value.selector = false;
        });
      }

      /**
       * updateCheckboxItems
       * @param data
       * @param isCheckAllItems
       * @param itemsRemoved
       * @param itemsChecked
       */
      function updateCheckboxItems(data, isCheckAllItems, itemsRemoved, itemsChecked) {
        itemsChecked = itemsChecked || [];

        if (isCheckAllItems) {
          _.forEach(data, function (value, key) {
            if (itemsRemoved.indexOf(value.id) === -1) {
              value.selector = true;
            }
          });
        } else {
          _.forEach(data, function (value, key) {
            if (itemsChecked && itemsChecked.indexOf(value.id) !== -1) {
              value.selector = true;
            }
          });
          if (itemsChecked) {
            _.forEach(data, function (value, key) {
              if (itemsChecked.indexOf(value.id) !== -1) {
                value.selector = true;
              }
            });
          }
        }
      }

      /**
       * get list common areas
       * @param params
       * @returns {HttpPromise}
       */
      function getCommonArea(params) {
        return $http.get(appConstant.domain + '/api/common/areas', {params: params});
      }

      /**
       * get list common lines
       * @param params
       * @returns {HttpPromise}
       */
      function getCommonLine(params) {
        return $http.get(appConstant.domain + '/api/common/lines', {params: params});
      }

      /**
       * get list common machines
       * @param params
       * @returns {HttpPromise}
       */
      function getCommonMachine(params) {
        return $http.get(appConstant.domain + '/api/common/machines', {params: params});
      }

      /**
       * get list common components
       * @param params
       * @returns {HttpPromise}
       */
      function getCommonComponent(params) {
        return $http.get(appConstant.domain + '/api/common/components', {params: params});
      }

      /**
       * get list common symptoms
       * @param params
       * @returns {HttpPromise}
       */
      function getCommonSymptom(params) {
        return $http.get(appConstant.domain + '/api/common/symptoms', {params: params});
      }

      /**
       * get list common potential causes
       * @param params
       * @returns {HttpPromise}
       */
      function getCommonPotentialCause(params) {
        return $http.get(appConstant.domain + '/api/common/potentials', {params: params});
      }

      /**
       * get total count of issue or troubleshoot
       * @param type
       * @returns {HttpPromise}
       */
      function getTotalCount(type) {
        return $http.get(appConstant.domain + '/api/notification/count/' + type);
      }

      /**
       * get list all notifications
       * @param model
       * @returns {HttpPromise}
       */
      function getNotificationList(model) {
        return $http.post(appConstant.domain + '/api/notification/search', model, {
          hideErrorMessage: true
        });
      }

      /**
       * get list top latest notification
       * @param model
       * @returns {HttpPromise}
       */
      function getNotificationTopList(model) {
        return $http.post(appConstant.domain + '/api/notification/search/topnotification', model, {
          hideErrorMessage: true
        });
      }

      /**
       * get tree view
       * @param param
       * @returns {HttpPromise}
       */
      function getTreeView(param) {
        return $http.get(appConstant.domain + '/api/common/treeview', {
          params: {
            areaIds: param ? param.areaIds : null,
            lineIds: param ? param.lineIds : null
          }
        });
      }

      /**
       * get issue list
       * @param params
       * @returns {HttpPromise}
       */
      function getIssueList(params) {
        return $http.get(appConstant.domain + '/api/common/issues', {params: params});
      }

      /**
       * clear notification
       * @param param
       * @returns {HttpPromise}
       */
      function clearNotification(param) {
        return $http.delete(appConstant.domain + '/api/notification', {
          params: {
            mode: param.mode,
            type: param.type,
            isAll: param.isAll,
            fromDate: param.fromDate,
            toDate: param.toDate
          }
        }, {
          message: "MESSAGES.CLEAR_NOTIFICATION_SUCCESSFUL"
        });
      }


      services.updateItem = updateItem;
      services.checkAllItems = checkAllItems;
      services.removeAllItems = removeAllItems;
      services.updateCheckboxItems = updateCheckboxItems;
      services.getTotalCount = getTotalCount;
      services.getNotificationList = getNotificationList;
      services.getNotificationTopList = getNotificationTopList;
      services.getTreeView = getTreeView;
      services.getIssueList = getIssueList;
      services.clearNotification = clearNotification;

      services.getCommonArea = getCommonArea;
      services.getCommonLine = getCommonLine;
      services.getCommonMachine = getCommonMachine;
      services.getCommonComponent = getCommonComponent;
      services.getCommonSymptom = getCommonSymptom;
      services.getCommonPotentialCause = getCommonPotentialCause;

      return services;
    }]);
  return module.name;
});
