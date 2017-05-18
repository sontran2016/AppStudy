define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    '$scope',
    '$state',
    '$translate',
    'lineFactory',
    'data',
    'notifications',
    function ($scope,
              $state,
              $translate,
              lineFactory,
              data,
              notifications) {

      var vm = this;

      notifications.onLibraryChanged($scope, function (args) {
        $state.reload();
      });

      vm.conf = {
        module: 'lines',
        showHeading: true,
        rowClickable: false,
        heading: $translate.instant('LINE.HEADING'),
        addLabel: $translate.instant('LINE.BTN_ADD'),
        addLink: 'app.lineAdd',
        editLink: 'app.lineEdit',
        commonData: data,
        getListFn: lineFactory.getList,
        removeFn: lineFactory.removeItems,
        sorting: {
          createOnDate: 'desc'
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
            field: "lineCode",
            title: $translate.instant('LINE.LINE_CODE'),
            show: true,
            dataType: "text",
          },
          {
            field: "name",
            title: $translate.instant('LINE.LINE_NAME'),
            show: true,
            dataType: "text",
          },
          {
            field: "shortName",
            title: $translate.instant('GENERAL.SHORT_NAME'),
            show: true,
            dataType: "text",
          },
          {
            field: "areaName",
            title: $translate.instant('GENERAL.AREA'),
            show: true,
            dataType: "issueAreaLabel",
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
            dataType: "command",
            width: "5%"
          }
        ]
      }; 

    }];
  return controller;
});
