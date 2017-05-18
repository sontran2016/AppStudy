define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    '$scope',
    '$state',
    '$translate',
    'areaFactory',
    'notifications',
    function ($scope,
              $state,
              $translate,
              areaFactory,
              notifications) {

      var vm = this;

      notifications.onLibraryChanged($scope, function (args) {
        $state.reload();
      });

      vm.conf = {
        module: 'areas',
        showHeading: true,
        rowClickable: false,
        heading: $translate.instant('AREA.HEADING'),
        addLabel: $translate.instant('AREA.BTN_ADD'),
        addLink: 'app.areaAdd',
        editLink: 'app.areaEdit',
        getListFn: areaFactory.getList,
        removeFn: areaFactory.removeItems,
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
            title: $translate.instant('AREA.SEARCH_NAME'),
            show: true,
            dataType: "text",
            width: "20%"
          },
          {
            field: "shortName",
            title: $translate.instant('GENERAL.SHORT_NAME'),
            show: true,
            dataType: "text",
          },
          {
            field: "description",
            title: $translate.instant('GENERAL.DESCRIPTION'),
            show: true,
            dataType: "text"
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
