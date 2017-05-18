define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    '$scope',
    '$state',
    '$translate',
    'troubleshootFactory',
    'data',
    'notifications',
    function ($scope,
              $state,
              $translate,
              troubleshootFactory,
              data,
              notifications) {

      var vm = this;

      /**
       * add trouble to my favorite list
       * @param id
       */
      function addToFavorite(troubleList, id) {
        troubleshootFactory.addToFavorite(id).then(function () {
          troubleList[_.findIndex(troubleList, function (obj) {
            return obj.id === id;
          })].isFavorited = true;
        });
      }

      notifications.onTroubleCountChanged($scope, function (args) {
        $state.reload();
      });

      notifications.onTroubleshootCountChanged($scope, function (args) {
        if(args.data.IsProccessed === false) {
          $state.reload();
        }
      });

      vm.conf = {
        module: 'troubles',
        showHeading: true,
        rowClickable: true,
        heading: $translate.instant('TROUBLESHOOT.HEADING'),
        editLink: 'app.troubleshootEdit',
        detailLink: 'app.troubleshootDetails',
        commonData: data,
        getListFn: troubleshootFactory.getTroubleshootList,
        removeFn: troubleshootFactory.removeItems,
        deleteInactiveFn: troubleshootFactory.deleteInactiveItems,
        addToFavoriteFn: function (troubleList, id) {
          return addToFavorite(troubleList, id);
        },
        cols: [
          {
            field: "selector",
            title: "",
            headerTemplateURL: "ng-table/headers/checkbox.html",
            show: true,
            dataType: "selector",
            width: "5%"
          },
          {
            field: "troubleCode",
            title: $translate.instant('TROUBLESHOOT.CODE'),
            show: true,
            dataType: "text",
            width: "15%"
          },
          {
            field: "title",
            title: $translate.instant('GENERAL.TITLE'),
            show: true,
            dataType: "text"
          },
          {
            field: "lineName",
            title: $translate.instant('GENERAL.LINE'),
            show: true,
            dataType: "issueLineLabel",
            width: "10%"
          },
          {
            field: "areaName",
            title: $translate.instant('GENERAL.AREA'),
            show: true,
            dataType: "issueAreaLabel",
            width: "10%"
          },
          {
            field: "createdBy",
            title: $translate.instant('TROUBLESHOOT.OWNER'),
            show: true,
            dataType: "ownerName",
            width: "15%"
          },
          {
            field: "status",
            title: $translate.instant('GENERAL.STATUS'),
            show: true,
            dataType: "troubleshootStatus",
            width: "5%"
          },
          {
            field: "isActive",
            title: $translate.instant('GENERAL.ACTIVE'),
            show: true,
            dataType: "option",
            width: "5%"
          },
          {
            field: "action",
            title: "",
            show: true,
            dataType: "troubleCommand",
            width: "5%"
          }
        ]
      };

    }];
  return controller;
});
