define(function (require) {
  'use strict';
  var angular = require('angular'),
    _ = require('lodash');
  var controller = [
    '$scope',
    '$state',
    '$translate',
    'data',
    'issueFactory',
    'fileFactory',
    'notifications',
    function ($scope,
              $state,
              $translate,
              data,
              issueFactory,
              fileFactory,
              notifications) {

      var vm = this;

      notifications.onIssueCountChanged($scope, function (args) {
        $state.reload();
      });

      function exportIssue(issueIds) {
        fileFactory.exportIssue(issueIds.join());
      }

      vm.conf = {
        module: 'issues',
        showHeading: true,
        rowClickable: true,
        heading: $translate.instant('ISSUE.HEADING'),
        addLabel: $translate.instant('ISSUE.BTN_ADD'),
        addLink: 'app.issueAdd',
        editLink: 'app.issueEdit',
        detailLink: 'app.issueDetails',
        commonData: data,
        getListFn: issueFactory.getIssueList,
        removeFn: issueFactory.removeItems,
        exportFn: function (issueIds) {
          return exportIssue(issueIds);
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
            field: "timestamp",
            title: 'Date',
            show: true,
            sortable: 'timestamp',
            dataType: "date",
            width: "5%"
          },
          {
            field: "title",
            title: 'Issue',
            show: true,
            sortable: 'title',
            dataType: "text",
            width: "25%"
          },
          {
            field: "symptom",
            title: 'Symptom',
            show: true,
            dataType: "issueSymptom",
            width: "15%"
          },
          {
            field: "lineName",
            title: 'Line',
            show: true,
            dataType: "issueLineLabel",
            width: "10%"
          },
          {
            field: "areaName",
            title: 'Area',
            show: true,
            dataType: "issueAreaLabel",
            width: "10%"
          },
          {
            field: "createdBy",
            title: 'Owner',
            show: true,
            dataType: "ownerName",
            width: "10%"
          },
          {
            field: "potentialCauseDescription",
            title: 'Potential Cause (Unconfirmed/ Total)',
            show: true,
            dataType: "number",
            width: "10%"
          },
          {
            field: "issueStatus",
            title: 'Status',
            show: true,
            dataType: "issueStatusLabel",
            width: "5%"
          },
          {
            field: "action",
            title: "",
            show: true,
            dataType: "issueCommand",
            width: "5%"
          }
        ]
      };
    
    }];
  return controller;
});
