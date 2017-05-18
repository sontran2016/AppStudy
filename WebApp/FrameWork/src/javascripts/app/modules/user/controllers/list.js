define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    '$translate',
    'data',
    'userFactory',
    function ($translate,
              data,
              userFactory) {

      var vm = this;

      vm.conf = {
        module: 'users',
        showHeading: true,
        rowClickable: false,
        heading: $translate.instant('USER.HEADING'),
        addLabel: $translate.instant('USER.BTN_ADD'),
        addLink: 'app.userAdd',
        editLink: 'app.userEdit',
        commonData: data,
        sorting: {
          updateOnDate: 'desc'
        },
        getListFn: userFactory.getList,
        removeFn: userFactory.removeItems,
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
            field: "userName",
            title: $translate.instant('USER.USERNAME'),
            show: true,
            dataType: "text"
          },
          {
            field: "fullName",
            title: $translate.instant('GENERAL.NAME'),
            show: true,
            dataType: "text"
          },
          {
            field: "email",
            title: $translate.instant('USER.EMAIL'),
            show: true,
            dataType: "text"
          },
          {
            field: "phone",
            title: $translate.instant('USER.PHONE'),
            show: true,
            dataType: "text"
          },
          {
            field: "role",
            title: $translate.instant('USER.ROLE'),
            show: true,
            dataType: "userRole"
          },
          {
            field: "areas",
            title: $translate.instant('USER.DEPARTMENT'),
            show: true,
            dataType: "userDepartment",
            width: "20%"
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
