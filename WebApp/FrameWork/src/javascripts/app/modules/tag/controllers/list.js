define(function (require) {
  'use strict';
  var controller = [
    '$translate',
    'tagFactory',
    function ($translate,
              tagFactory) {

      var vm = this;

      vm.conf = {
        module: 'tags',
        showHeading: true,
        rowClickable: false,
        heading: $translate.instant('TAG.HEADING'),
        addLabel: $translate.instant('TAG.BTN_ADD'),
        addLink: 'app.tagAdd',
        editLink: 'app.tagEdit',
        getListFn: tagFactory.getTagList,
        removeFn: tagFactory.removeItems,
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
            title: $translate.instant('GENERAL.NAME'),
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
