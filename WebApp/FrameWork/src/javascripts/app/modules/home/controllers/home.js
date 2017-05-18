define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');

  var role = require('text!app/common/resources/user/role.json');
  var controller = [
    '$scope',
    '$rootScope',
    '$window', '$interval',
    'dashboardData',
    'userContext',
    'moment',
    'opcGroupFactory', 'opcTagFactory',
    function ($scope,
              $rootScope,
              $window,$interval,
              dashboardData,
              userContext,
              moment,
              opcGroupFactory, opcTagFactory) {

      var vm = this;

      /**
       * generate issue chart
       */
      function generateChart() {
        _.forEach(vm.issuesChart, function (issue) {
          vm.dates.push(moment(issue.date).format('DD/MM/YYYY'));
          vm.issueSolvedCount.push(issue.solved);
          vm.issueUnsolvedCount.push(issue.unsolved);
        });

        //option for chart show issue count in each area
        vm.issueAreaChartOptions = {
          tooltip: {
            visible: true,
            format: "{0}"
          },
          categoryAxis: {
            categories: vm.dates,
            labels: {
              font: '12px OpenSans'
            },
            majorGridLines: {
              visible: false
            }
          },
          series: [{
            name: 'Solved',
            data: vm.issueSolvedCount,
            color: '#409C3E'
          }, {
            name: 'Unsolved',
            data: vm.issueUnsolvedCount,
            color: '#FEBA35'
          }],
          legend: {
            visible: true,
            position: "bottom",
            align: "center"
          },
          valueAxis: {
            line: {
              visible: false
            },
            minorGridLines: {
              visible: true
            }
          },
        };

        // option for chart show percent of each issue type
        vm.issueChartOptions = {
          seriesDefaults: {
            pie: {
              color: "red"
            }
          },
          series: [{
            type: "pie",
            data: [{
              category: "Solved",
              value: vm.issuesCount.solvedPercent,
              color: "#1F78B4"
            }, {
              category: "Unsolved",
              value: vm.issuesCount.unsolvedPercent,
              color: "#FE7F0E"
            }]
          }],
          legend: {
            position: "bottom",
            align: "center",
            label: {
              font: "18px"
            }
          },
          tooltip: {
            visible: true,
            format: "{0}%"
          }
        };
      }

      vm.issueConf = {
        module: 'dashboard_issue',
        showHeading: false,
        rowClickable: true,
        detailLink: 'app.issueDetails',
        listData: function () {
          return dashboardData.latestIssues;
        },
        cols: [
          {
            field: "createOnDate",
            title: 'Issue Date',
            show: true,
            dataType: "date",
            width: "10%"
          },
          {
            field: "title",
            title: 'Issue',
            show: true,
            dataType: "text"
          },
          {
            field: "createdBy",
            title: 'Owner',
            show: true,
            dataType: "ownerName",
            width: "20%"
          }
        ]
      };

      vm.opcViewerConf = {
          module: 'opc_viewer',
          showHeading: false,
          getListFn: opcTagFactory.getList,
          //listData: function () {
          //    opcTagFactory.getList().success(function (resp) {
          //        vm.opcViewerData = resp;
          //        return vm.opcViewerData;
          //    });
          //    //vm.opcViewerData = opcTagFactory.getList();
          //    //return vm.opcViewerData;
          //},
          //listData: function () {
          //    opcTagFactory.getList().success(function (resp) {
          //        vm.opcViewerData = resp;
          //        console.log('a1: ', resp);
          //    });
          //    //[{ index: 1, tag: 'tag1', value: 20, status: 'good' },
          //    //    { index: 2, tag: 'tag2', value: 21, status: 'good' },
          //    //    { index: 3, tag: 'tag3', value: 22, status: 'good' }];
          //},
          cols: [
            {
                field: "index",
                title: 'Index',
                show: true,
                dataType: "text",
                width: "10%"
            },
            {
                field: "tag",
                title: 'Tag Name',
                show: true,
                dataType: "text"//,width: "30%"
            },
            {
                field: "value",
                title: 'Value',
                show: true,
                dataType: "text"
            },
            {
                field: "status",
                title: 'Status',
                show: true,
                dataType: "text"
            }
          ]
      };

      vm.troubleshootConf = {
        module: 'dashboard_troubleshoot',
        showHeading: false,
        rowClickable: true,
        detailLink: 'app.troubleshootDetails',
        listData: function () {
          return dashboardData.recentlyTroubles;
        },
        cols: [
          {
            field: "title",
            title: 'Title',
            show: true,
            dataType: "text"
          },
          {
            field: "createdBy",
            title: 'Owner',
            show: true,
            dataType: "ownerName",
            width: "20%"
          }
        ]
      };

      var widgetAdminDefinitions = [
        {
          name: 'opc group',
          templateUrl: 'home/templates/detail/opc-group.html',
          title: "Opc Group",
          size: {width: '20%'}
        },
        {
            name: 'opc viewer',
            templateUrl: 'home/templates/detail/opc-viewer.html',
            title: "Opc Viewer",
            size: { width: '80%' }
        }
    //  ,{
    //      name: 'issue count',
    //      templateUrl: 'home/templates/detail/issue-count.html',
    //    title: "Issues",
    //    size: {width: '20%'}
    //},
        //{
        //    name: 'lastest issue',
        //    templateUrl: 'home/templates/detail/lastest-issue.html',
        //    title: "Lasted 10 Issues of Supply Chain",
        //    size: {width: '100%'}
        //}

        //{
        //  name: 'trouble count',
        //  templateUrl: 'home/templates/detail/trouble-count.html',
        //  title: "Troubleshoots",
        //  size: {
        //    width: '40%'
        //  }
        //}
        //{
        //  name: 'recently troubleshoot',
        //  templateUrl: 'home/templates/detail/recently-troubleshoot.html',
        //  title: "Recently Troubleshoots",
        //  size: {
        //    width: '50%'
        //  }
        //},
        //{
        //  name: 'top trouble rating',
        //  templateUrl: 'home/templates/detail/trouble-rating.html',
        //  title: "Top Troubleshoot Rating",
        //  size: {
        //    width: '50%'
        //  }
        //},
        //{
        //  name: 'top user created trouble',
        //  templateUrl: 'home/templates/detail/top-user-trouble.html',
        //  title: "Top User Created Troubleshoot",
        //  size: {
        //    width: '50%'
        //  }
        //},
        //{
        //  name: 'issue tracking',
        //  templateUrl: 'home/templates/detail/issue-tracking.html',
        //  title: "Issues Tracking",
        //  size: {
        //    width: '70%'
        //  }
        //},
        //{
        //  name: 'issue resolve chart',
        //  templateUrl: 'home/templates/detail/issue-chart.html',
        //  title: "Issues Solved/ Unsolved",
        //  size: {
        //    width: '30%'
        //  }
        //}
      ];

      var widgetUserDefinitions = [
        {
          name: 'lastest issue',
          templateUrl: 'home/templates/detail/lastest-issue.html',
          title: "Lasted 10 Issues of Supply Chain",
          size: {
            width: '50%'
          }
        },
        {
          name: 'issue count',
          templateUrl: 'home/templates/detail/issue-count.html',
          title: "Issues",
          size: {
            width: '50%'
          }
        },
        {
          name: 'trouble count',
          templateUrl: 'home/templates/detail/trouble-count.html',
          title: "Troubleshoots",
          size: {
            width: '50%'
          }
        },
        {
          name: 'recently troubleshoot',
          templateUrl: 'home/templates/detail/recently-troubleshoot.html',
          title: "Recently Troubleshoots",
          size: {
            width: '50%'
          }
        },
        {
          name: 'my trouble',
          templateUrl: 'home/templates/detail/my-trouble.html',
          title: "My Troubleshoots",
          size: {
            width: '50%'
          }
        },
        {
          name: 'issue tracking',
          templateUrl: 'home/templates/detail/issue-tracking.html',
          title: "Issues Tracking",
          size: {
            width: '70%'
          }
        },
        {
          name: 'issue resolve chart',
          templateUrl: 'home/templates/detail/issue-chart.html',
          title: "Issues Solved/ Unsolved",
          size: {
            width: '30%'
          }
        }
      ];

      var defaultAdminWidgets = [
        { name: 'opc group' },
        { name: 'opc viewer' },
        {name: 'lastest issue'}
        //{name: 'issue count'},
        //{name: 'trouble count'},
        //{name: 'recently troubleshoot'},
        //{name: 'top trouble rating'},
        //{name: 'top user created trouble'},
        //{name: 'issue tracking'},
        //{ name: 'issue resolve chart' },

      ];

      var defaultUserWidgets = [
        {name: 'lastest issue'},
        {name: 'issue count'},
        {name: 'trouble count'},
        {name: 'recently troubleshoot'},
        {name: 'my trouble'},
        {name: 'issue tracking'},
        {name: 'issue resolve chart'}
      ];

      vm.dashboardAdminOptions = {
        widgetButtons: false,
        widgetDefinitions: widgetAdminDefinitions,
        defaultWidgets: defaultAdminWidgets,
        hideToolbar: true,
        hideWidgetName: true,
        hideWidgetClose: true,
        enableVerticalResize: false,
        storage: $window.localStorage,
        storageId: 'dashboard',
        sortableOptions: {
          handle: '.widget-header',
          cursor: 'move'
        }
      };

      vm.dashboardUserOptions = {
        widgetButtons: false,
        widgetDefinitions: widgetUserDefinitions,
        defaultWidgets: defaultUserWidgets,
        hideToolbar: true,
        hideWidgetName: true,
        hideWidgetClose: true,
        enableVerticalResize: false,
        storage: $window.localStorage,
        storageId: 'dashboard',
        sortableOptions: {
          handle: '.widget-header',
          cursor: 'move'
        }
      };

      vm.dates = [];
      vm.issueSolvedCount = [];
      vm.issueUnsolvedCount = [];

      vm.permission = userContext.getPermissions();
      vm.currentUser = $rootScope.currentUserInfo;
      vm.roleList = angular.fromJson(role);

      vm.latestIssues = dashboardData.latestIssues;
      vm.recentlyTroubles = dashboardData.recentlyTroubles;
      vm.topRateTroubles = dashboardData.topRateTroubles;
      vm.topUserCreatedTroubles = dashboardData.topUserCreatedTroubles;
      vm.myTroubles = dashboardData.myTroubles;
      vm.troubleCount = dashboardData.troubleStatistic;
      vm.issuesCount = dashboardData.issuesCount;
      vm.issuesChart = dashboardData.issuesChart;

      //console.log('a3: ', vm.latestIssues);
        
      //vm.opcViewerData = [{ index: 1, tag: 'tag1', value: 20, status: 'good' },
      //    { index: 2, tag: 'tag2', value: 21, status: 'good' },
      //    { index: 3, tag: 'tag3', value: 22, status: 'good' }];

      opcGroupFactory.getList().success(function (resp) {
          vm.data = resp;
          //console.log('a2: ', resp);
      });
        //vm.data = {
        //    servers: [
        //        {
        //            "id": 1,
        //            "name": "Server 1",
        //            groups: [{ "id": 1, "name": "Group 1" }, { "id": 2, "name": "Group 2" }]
        //        },
        //        {
        //            "id": 2,
        //            "name": "Server 2",
        //            groups: [{ "id": 3, "name": "Group 3" }, { "id": 4, "name": "Group 4" }]
        //        }
        //    ]
        //};
        //vm.data = [];

        generateChart();

        //$interval(function () {
        //    //opcGroupFactory.getList().success(function(resp) {
        //    //        vm.data = resp;
        //    //    });

        //    //vm.opcViewerData[0].value++;

        //    //opcTagFactory.getList().success(function (resp) {
        //    //    vm.opcViewerData = resp;
        //    //});
        //}, 1000);
    }];

  return controller;
});
