define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    '$scope',
    '$state',
    '$translate',
    'machineFactory',
    'data',
    'notifications',
    function ($scope,
              $state,
              $translate,
              machineFactory,
              data,
              notifications) {

      var vm = this;

      notifications.onLibraryChanged($scope, function (args) {
        $state.reload();
      });

      vm.conf = {
        module: 'machines',
        showHeading: true,
        rowClickable: false,
        heading: $translate.instant('MACHINE.HEADING'),
        addLabel: $translate.instant('MACHINE.BTN_ADD'),
        addLink: 'app.machineAdd',
        editLink: 'app.machineEdit',
        commonData: data,
        getListFn: machineFactory.getList,
        removeFn: machineFactory.removeItems,
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
            field: "name",
            title: $translate.instant('MACHINE.NAME'),
            show: true,
            dataType: "text",
            width: "20%"
          },
          {
            field: "shortName",
            title: $translate.instant('GENERAL.SHORT_NAME'),
            show: true,
            dataType: "text",
            width: "15%"
          },
          {
            field: "areaName",
            title: $translate.instant('GENERAL.AREA'),
            show: true,
            dataType: "issueAreaLabel",
            width: "15%"
          },
          {
            field: "lineName",
            title: $translate.instant('GENERAL.LINE'),
            show: true,
            dataType: "issueLineLabel",
            width: "15%"
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
