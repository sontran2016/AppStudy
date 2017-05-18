define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    '$scope',
    '$state',
    '$translate',
    'componentFactory',
    'data',
    'notifications',
    function ($scope,
              $state,
              $translate,
              componentFactory,
              data,
              notifications) {

      var vm = this;

      notifications.onLibraryChanged($scope, function (args) {
        $state.reload();
      });

      vm.conf = {
        module: 'components',
        showHeading: true,
        rowClickable: false,
        heading: $translate.instant('COMPONENT.HEADING'),
        addLabel: $translate.instant('COMPONENT.BTN_ADD'),
        addLink: 'app.componentAdd',
        editLink: 'app.componentEdit',
        commonData: data,
        getListFn: componentFactory.getList,
        removeFn: componentFactory.removeItems,
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
            title: $translate.instant('COMPONENT.NAME'),
            show: true,
            dataType: "text",
            width: "20%"
          },
          {
            field: "shortName",
            title: $translate.instant('GENERAL.SHORT_NAME'),
            show: true,
            dataType: "text",
            width: "15%",
          },
          {
            field: "areaName",
            title: $translate.instant('GENERAL.AREA'),
            show: true,
            dataType: "areaLabel",
            width: "15%"
          },
          {
            field: "lineName",
            title: $translate.instant('GENERAL.LINE'),
            show: true,
            dataType: "lineLabel",
            width: "15%"
          },
          {
            field: "machineName",
            title: $translate.instant('GENERAL.MACHINE'),
            show: true,
            dataType: "machineLabel",
            width: "10%"
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
