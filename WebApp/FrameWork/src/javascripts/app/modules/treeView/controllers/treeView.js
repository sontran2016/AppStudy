define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    '$scope',
    '$rootScope',
    'userContext',
    'commonFactory',
    'data',
    'user',
    function ($scope,
              $rootScope,
              userContext,
              commonFactory,
              data,
              user) {

      var vm = this;

      function getTree() {
        var param = {
          areaIds: _.isArray(vm.filter.areaIds) ? _.map(vm.filter.areaIds, 'id').toString() : vm.filter.areaIds,
          lineIds: _.isArray(vm.filter.lineIds) ? _.map(vm.filter.lineIds, 'id').toString() : vm.filter.areaIds
        };
        commonFactory.getTreeView(param).then(function (resp) {
          vm.data = resp.data;
          vm.data.areas = _.filter(vm.data.areas, function (obj) {
            return _.indexOf(vm.userAreas, obj.area.id) > -1;
          });

          _.forEach(vm.data.areas, function (area) {
            area.isCollapsed = true;

            _.forEach(area.lines, function (line) {
              line.isCollapsed = true;

              _.forEach(line.issues, function (issue) {
                issue.isCollapsed = true;
                issue.issue.symptom.isCollapsed = true;

                _.forEach(issue.issue.symptom.potentialCauses, function (potential) {
                  potential.isCollapsed = true;
                });
              });

              _.forEach(line.machines, function (machine) {
                machine.isCollapsed = true;

                _.forEach(machine.issues, function (issue) {
                  issue.isCollapsed = true;
                  issue.issue.symptom.isCollapsed = true;

                  _.forEach(issue.issue.symptom.potentialCauses, function (potential) {
                    potential.isCollapsed = true;
                  });
                });

                _.forEach(machine.components, function (component) {
                  component.isCollapsed = true;

                  _.forEach(component.issues, function (issue) {
                    issue.isCollapsed = true;
                    issue.issue.symptom.isCollapsed = true;

                    _.forEach(issue.issue.symptom.potentialCauses, function (potential) {
                      potential.isCollapsed = true;
                    });
                  });

                  _.forEach(component.symptoms, function (symptom) {
                    symptom.isCollapsed = true;

                    _.forEach(symptom.potentialCauses, function (potential) {
                      potential.isCollapsed = true;
                    });
                  });
                });
              });
            });
          });
        });
      }

      /**
       * filter line belong to selected area
       */
      function filterLine() {
        vm.filter.lineIds = [];
        var param = {
          areaId: _.map(vm.filter.areaIds, 'id')
        }
        commonFactory.getCommonLine(param).then(function (resp) {
          vm.lineList = _.filter(resp.data, function (obj) {
            return _.indexOf(vm.userLines, obj.id) > -1;
          });
        });
        getTree();
      }


      vm.isCollapsed = true;
      vm.userAreas = _.map(user.areas, 'id');
      vm.userLines = _.map(user.lines, 'id');
      vm.areas = data;

      vm.filter = {
        'areaIds': [],
        'lineIds': []
      };

      vm.getTree = getTree;
      vm.filterLine = filterLine;

      getTree();

    }];
  return controller;
});
