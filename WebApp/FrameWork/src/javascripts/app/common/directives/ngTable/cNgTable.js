define(function (require) {
  'use strict';
  var angular = require('angular'),
    _ = require('lodash'),
    role = require('text!app/common/resources/user/role.json'),
    tpl = require('text!./templates/cNgTable.html'),
    tagFilterTpl = require('text!./templates/filter/tag.html'),
    areaFilterTpl = require('text!./templates/filter/area.html'),
    lineFilterTpl = require('text!./templates/filter/line.html'),
    machineFilterTpl = require('text!./templates/filter/machine.html'),
    componentFilterTpl = require('text!./templates/filter/component.html'),
    userFilterTpl = require('text!./templates/filter/user.html'),
    symptomFilterTpl = require('text!./templates/filter/symptom.html'),
    potentialCauseFilterTpl = require('text!./templates/filter/potentialCause.html'),
    issueFilterTpl = require('text!./templates/filter/issue.html'),
    troubleshootFilterTpl = require('text!./templates/filter/troubleshoot.html'),

    moduleList = require('text!app/common/resources/common/module.json'),
    roleList = angular.fromJson(require('text!./../../resources/user/role.json')),
    statusList = angular.fromJson(require('text!./../../resources/user/status.json')),
    issueStatus = require('text!./../../resources/issue/detail_status.json'),
    issueStatusList = angular.fromJson(require('text!./../../resources/issue/list_status.json')),
    troubleStatusList = angular.fromJson(require('text!./../../resources/troubleshoot/list_status.json')),
    shootingStatus = require('text!./../../resources/troubleshoot/status.json'),

    module;

  module = angular.module('common.directives.cNgTable', []);

  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('cNgTableTpl.html', tpl);
      $templateCache.put('filter/tag.html', tagFilterTpl);
      $templateCache.put('filter/area.html', areaFilterTpl);
      $templateCache.put('filter/line.html', lineFilterTpl);
      $templateCache.put('filter/machine.html', machineFilterTpl);
      $templateCache.put('filter/component.html', componentFilterTpl);
      $templateCache.put('filter/user.html', userFilterTpl);
      $templateCache.put('filter/symptom.html', symptomFilterTpl);
      $templateCache.put('filter/potentialCause.html', potentialCauseFilterTpl);
      $templateCache.put('filter/issue.html', issueFilterTpl);
      $templateCache.put('filter/troubleshoot.html', troubleshootFilterTpl);
    }]);

  module.directive('cNgTable', [
    '$timeout',
    '$state',
    '$interval',
    '$rootScope',
    'appConstant',
    'NgTableParams',
    'commonFactory',
    'userContext',
    '$uibModal',
    'signalRFactory',
    'areaFactory',
    'lineFactory',
    'machineFactory',
    'componentFactory',
    'symptomFactory',
    'potentialCauseFactory',
    function ($timeout,
              $state,
              $interval,
              $rootScope,
              appConstant,
              NgTableParams,
              commonFactory,
              userContext,
              $uibModal,
              signalRFactory,
              areaFactory,
              lineFactory,
              machineFactory,
              componentFactory,
              symptomFactory,
              potentialCauseFactory) {

      /**
       * Link function
       * @param scope
       * @param element
       */
      function linkFn(scope, element) {
        scope.vm.instance = scope.vm.tableParams;
      }

      /**
       * Controller
       * @param $scope
       */
      function ctrlFn($scope) {
        var vm = this;

        function initData(module) {
          switch(module) {
            case vm.modules.USER: {
              vm.areas = vm.conf.commonData;
              vm.roles = _.map(roleList, function (value, key) {
                return value;
              });
              vm.roles = _.filter(vm.roles, function (obj) {
                return obj.value !== 'admin';
              });
              vm.statusList = statusList;
              break;
            }
            case vm.modules.ISSUE: {
              vm.areaList = vm.conf.commonData;
              vm.issueStatusList = issueStatusList;

              if(vm.storageFilter) {
                vm.lineList = _.filter(vm.lines, function (obj) {
                  return obj.areaId === vm.storageFilter.filter.areaId && obj.isActive === true;
                });

                vm.machineList = _.filter(vm.machines, function (obj) {
                  return obj.lineId === vm.storageFilter.filter.lineId && obj.isActive === true;
                });

                vm.componentList = _.filter(vm.components, function (component) {
                  var machineComponentIds = _.map(component.machines, 'id');
                  return  _.some(machineComponentIds, function (obj) {
                    return obj === vm.storageFilter.filter.machineId && component.isActive === true;
                  });
                });

                vm.listModel.areaId = vm.storageFilter.filter.areaId;
                vm.listModel.lineId = vm.storageFilter.filter.lineId;
                vm.listModel.machineId = vm.storageFilter.filter.machineId;
                vm.listModel.componentId = vm.storageFilter.filter.componentId;
                vm.listModel.symptomId = vm.storageFilter.filter.symptomId;
                vm.listModel.notHaveTrouble = vm.storageFilter.filter.notHaveTrouble;
                vm.listModel.isOnlyMe = vm.storageFilter.filter.isOnlyMe;
                vm.listModel.listStatus = vm.storageFilter.filter.listStatus;
                vm.keyword = vm.storageFilter.filter.keyword;
              }
              break;
            }
            case vm.modules.DASHBOARD_ISSUE: {
              vm.areaList = '';
              vm.lines = '';
              vm.machines = '';
              vm.components = '';
              vm.issueStatusList = '';
              vm.symptomList = '';
              break;
            }
            case vm.modules.TROUBLESHOOT: {
              vm.areas = vm.conf.commonData;
              vm.troubleStatusList = troubleStatusList;

              if(vm.storageFilter) {
                vm.lineList = _.filter(vm.lines, function (obj) {
                  return obj.areaId === vm.storageFilter.filter.areaId && obj.isActive === true;
                });

                vm.machineList = _.filter(vm.machines, function (obj) {
                  return obj.lineId === vm.storageFilter.filter.lineId && obj.isActive === true;
                });

                vm.potentialCauseList = _.filter(vm.potentialCauses, function (obj) {
                  return obj.symptomId === vm.storageFilter.filter.symptomId && obj.isActive === true;
                });

                vm.listModel.areaId = vm.storageFilter.filter.areaId;
                vm.listModel.lineId = vm.storageFilter.filter.lineId;
                vm.listModel.machineId = vm.storageFilter.filter.machineId;
                vm.listModel.symptomId = vm.storageFilter.filter.symptomId;
                vm.listModel.potentialCauseId = vm.storageFilter.filter.potentialCauseId;
                vm.isActive = vm.storageFilter.filter.isActive;
                vm.listModel.isOnlyMe = vm.storageFilter.filter.isOnlyMe;
                vm.listModel.listStatus = vm.storageFilter.filter.listStatus;
                vm.keyword = vm.storageFilter.filter.keyword;
              }

              break;
            }
            case vm.modules.DASHBOARD_TROUBLESHOOT: {
              vm.areas = '';
              vm.lines = '';
              vm.symptoms = '';
              vm.potentialCauses = '';
              vm.status = '';
              break;
            }
            case vm.modules.LINE: {
              vm.areas = vm.conf.commonData;
              break;
            }
            case vm.modules.MACHINE: {
              vm.areas = vm.conf.commonData;
              break;
            }
            case vm.modules.COMPONENT: {
              vm.areas = vm.conf.commonData;
              break;
            }
            case vm.modules.SYMPTOM: {
              vm.areas = vm.conf.commonData;
              break;
            }
            case vm.modules.POTENTIAL_CAUSE: {
              vm.areas = vm.conf.commonData;
              break;
            }
          }
        }

        /**
         * function set params to get list
         * @param module
         * @param params
         */
        function setParams(module, params) {
          switch(module) {
            case vm.modules.TAG: {
              params.isActive = vm.isActive;
              params.keyword = vm.keyword;
              break;
            }
            case vm.modules.AREA: {
              params.isActive = vm.isActive;
              params.keyword = vm.keyword;
              break;
            }
            case vm.modules.USER: {
              params.areaIds = vm.areaIds ? vm.areaIds.join(',') : null;
              params.role = vm.role;
              params.isActive = vm.isActive;
              params.keyword = vm.keyword;
              break;
            }
            case vm.modules.ISSUE: {
              params.symptomId = vm.storageFilter ? vm.storageFilter.filter.symptomId : vm.listModel.symptomId;
              params.listStatus = vm.storageFilter ? vm.storageFilter.filter.listStatus : vm.listModel.listStatus;
              params.areaId = vm.storageFilter ? vm.storageFilter.filter.areaId : vm.listModel.areaId;
              params.lineId = vm.storageFilter ? vm.storageFilter.filter.lineId : vm.listModel.lineId;
              params.machineId = vm.storageFilter ? vm.storageFilter.filter.machineId : vm.listModel.machineId;
              params.componentId = vm.storageFilter ? vm.storageFilter.filter.componentId : vm.listModel.componentId;
              params.isOnlyMe = vm.storageFilter ? vm.storageFilter.filter.isOnlyMe : vm.listModel.isOnlyMe;
              params.notHaveTrouble = vm.storageFilter ? vm.storageFilter.filter.notHaveTrouble : vm.listModel.notHaveTrouble;
              params.keyword = vm.storageFilter ? vm.storageFilter.filter.keyword : vm.keyword;
              break;
            }
            case vm.modules.TROUBLESHOOT: {
              params.potentialCauseId = vm.storageFilter ? vm.storageFilter.filter.potentialCauseId : vm.listModel.potentialCauseId;
              params.symptomId = vm.storageFilter ? vm.storageFilter.filter.symptomId : vm.listModel.symptomId;
              params.listStatus = vm.storageFilter ? vm.storageFilter.filter.listStatus : vm.listModel.listStatus;
              params.areaId = vm.storageFilter ? vm.storageFilter.filter.areaId : vm.listModel.areaId;
              params.lineId = vm.storageFilter ? vm.storageFilter.filter.lineId : vm.listModel.lineId;
              params.machineId = vm.storageFilter ? vm.storageFilter.filter.machineId : vm.listModel.machineId;
              params.isOnlyMe = vm.storageFilter ? vm.storageFilter.filter.isOnlyMe : vm.listModel.isOnlyMe;
              params.isActive = vm.storageFilter ? vm.storageFilter.filter.isActive : vm.isActive;
              params.keyword = vm.storageFilter ? vm.storageFilter.filter.keyword : vm.keyword;
              break;
            }
            case vm.modules.LINE: {
              params.areaFilter = vm.listModel.areaId;
              params.isActive = vm.isActive;
              params.keyword = vm.keyword;
              break;
            }
            case vm.modules.MACHINE: {
              params.areaId = vm.listModel.areaId;
              params.lineId = vm.listModel.lineId;
              params.isActive = vm.isActive;
              params.keyword = vm.keyword;
              break;
            }
            case vm.modules.COMPONENT: {
              params.areaId = vm.listModel.areaId;
              params.lineId = vm.listModel.lineId;
              params.machineId = vm.listModel.machineId;
              params.isActive = vm.isActive;
              params.keyword = vm.keyword;
              break;
            }
            case vm.modules.SYMPTOM: {
              params.areaId = vm.listModel.areaId;
              params.lineId = vm.listModel.lineId;
              params.machineId = vm.listModel.machineId;
              params.componentId = vm.listModel.componentId;
              params.isActive = vm.isActive;
              params.keyword = vm.keyword;
              break;
            }
            case vm.modules.POTENTIAL_CAUSE: {
              params.areaId = vm.listModel.areaId;
              params.lineId = vm.listModel.lineId;
              params.machineId = vm.listModel.machineId;
              params.componentId = vm.listModel.componentId;
              params.isActive = vm.isActive;
              params.keyword = vm.keyword;
              break;
            }
          }
        }

        /**
         * get data for table
         * @param $defer
         * @param params
         */
        function getData($defer, params) {
          setParams(vm.conf.module, params);

          if(vm.conf.listData) {
            if(vm.conf.pageOptions) {
              var pageOptions = vm.conf.pageOptions;
              params.total(pageOptions.totalCount);
            }

            vm.rows = vm.conf.listData();
            vm.listModel.itemsChecked = [];
            vm.listModel.isCheckAllItems = false;

            $defer.resolve(vm.rows);
            vm.conf.listData = null;

          } else {
            vm.conf.getListFn(params).then(function (resp) {
              params.total(resp.data.totalCount);
              vm.totalRecords = resp.data.totalCount;
              vm.totalUnits = resp.data.totalPages;
              vm.minItems = (params.page() - 1) * params.count() + 1;
              vm.maxItems = (params.count() * params.page() > params.total()) ? params.total() : params.count() * params.page();

              //if(vm.conf.module === vm.modules.DASHBOARD_ISSUE) {
              //  vm.rows = resp.data.issues;
              //}
              //else if(vm.conf.module === vm.modules.DASHBOARD_TROUBLESHOOT) {
              //  vm.rows = resp.data.troubles;
              //}
              //else {
              //  vm.rows = resp.data[vm.conf.module];
                //}

                vm.rows = resp.data;

              vm.listModel.itemsChecked = [];
              vm.listModel.isCheckAllItems = false;

              $defer.resolve(vm.rows);
            });
          }

          if(vm.conf.module !== 'shooting') {
            sessionStorage.removeItem('currentFilter');
            vm.storageFilter = null;
          }
        }

        /**
         * Search data
         */
        function search() {
          vm.storageFilter = JSON.parse(sessionStorage.getItem('currentFilter'));
          if(vm.storageFilter) {
            vm.tableParams = angular.extend(vm.tableParams, vm.storageFilter.filter);
            getData(null, vm.tableParams);
          } else {
            vm.tableParams.page(1);
            vm.tableParams.reload();
          }
          vm.listModel.itemsChecked = [];
          vm.listModel.isCheckAllItems = false;
        }

        /**
         * function check or uncheck all item on table
         * @param value
         */
        function checkAll(value) {
          //remove all list check and list remove
          vm.listModel.itemsChecked.splice(0, -1);

          vm.listModel.isCheckAllItems = !value;
          if (vm.listModel.isCheckAllItems) {
            vm.listModel.itemsChecked = [];
            commonFactory.checkAllItems(vm.tableParams.data);
            _.forEach(vm.tableParams.data, function (item) {
              vm.listModel.itemsChecked = commonFactory.updateItem(vm.listModel.isCheckAllItems, item, vm.listModel.itemsChecked, vm.rows);
            });

          } else {
            commonFactory.removeAllItems(vm.tableParams.data);
            vm.listModel.itemsChecked = [];
            vm.indeterminate = false;
          }
        }

        /**
         * function check or uncheck an item on table
         * @param item
         */
        function checkItem(item) {
          if(vm.conf.checkItemFn) {
            vm.conf.checkItemFn(item);
          } else {
            $timeout(function () {
              vm.listModel.itemsChecked = commonFactory.updateItem(vm.listModel.isCheckAllItems, item, vm.listModel.itemsChecked, vm.rows);
              vm.listModel.isCheckAllItems = vm.listModel.itemsChecked.length === vm.tableParams.total();
            });
          }
        }

        /**
         * function view detail of an item
         * @param row
         */
        function viewDetail(row) {
          if(vm.conf.viewDetailFn) {
            vm.conf.viewDetailFn(row);
          } else {
            $state.go(vm.conf.detailLink, {id: row.id});

            var currentFilter = {
              module: vm.conf.module,
              numPage: vm.tableParams.page(),
              pageSize: vm.tableParams.count(),
              filter: vm.tableParams
            };
            sessionStorage.setItem('currentFilter', JSON.stringify(currentFilter));
          }
        }

        /**
         * function call signalr hub delete library
         * @param userNames
         */
        function callHubDeleteLibrary(userNames) {
          var param = {
            userNames: _.map(userNames, 'userName')
          };
          signalRFactory.libraryHub.delete(param);
        }

        /**
         * delete inactive items
         */
        function deleteInactiveItem(item) {
          if(item) {
            vm.conf.deleteInactiveFn(vm.rows, item);
          } else {
            var ids = _.join(vm.listModel.itemsChecked, ',');
            vm.conf.deleteInactiveFn(ids).then(function () {
              vm.search();

              if(vm.conf.module === vm.modules.TROUBLESHOOT) {
                signalRFactory.troubleHub.deleteTrouble();
              }
            });
          }

          var currentFilter = {
            module: vm.conf.module,
            numPage: vm.tableParams.page(),
            pageSize: vm.tableParams.count(),
            filter: vm.tableParams
          };
          sessionStorage.setItem('currentFilter', JSON.stringify(currentFilter)); 
        }

        /**
         * Remove items
         */
        function remove(item) {
          if(item) {
            vm.conf.removeFn(vm.rows, item);
          } else {
            var ids = _.join(vm.listModel.itemsChecked, ',');
            vm.conf.removeFn(ids).then(function () {
              vm.search();

              var model = {};
              if(vm.conf.module === vm.modules.TROUBLESHOOT) {
                var params = {
                  troubleIds: vm.listModel.itemsChecked.join()
                };
                signalRFactory.troubleHub.deleteTrouble(params);
              } 
              else if (vm.conf.module === vm.modules.ISSUE) {
                var selectedIssues = _.filter(vm.rows, function (obj) {
                  return _.indexOf(vm.listModel.itemsChecked, obj.id) > -1;
                });
                var lineIds = _.map(selectedIssues, 'line.id');
                var param = {
                  lineIds: lineIds,
                  issueIds: vm.listModel.itemsChecked.join()
                };
                signalRFactory.issueHub.deleteIssue(param);
              }
              else if (vm.conf.module === vm.modules.AREA) {
                model = {
                  areaIds: vm.listModel.itemsChecked
                };
                areaFactory.getUsersOfArea(model).then(function (resp) {
                  callHubDeleteLibrary(resp.data.users);
                });
              } else if (vm.conf.module === vm.modules.LINE) {
                model = {
                  lineIds: vm.listModel.itemsChecked
                };
                lineFactory.getUsersOfLine(model).then(function (resp) {
                  callHubDeleteLibrary(resp.data.users);
                });
              } else if (vm.conf.module === vm.modules.MACHINE) {
                model = {
                  machineIds: vm.listModel.itemsChecked
                };
                machineFactory.getUsersOfMachine(model).then(function (resp) {
                  callHubDeleteLibrary(resp.data.users);
                });
              } else if (vm.conf.module === vm.modules.COMPONENT) {
                model = {
                  componentIds: vm.listModel.itemsChecked
                };
                componentFactory.getUsersOfComponent(model).then(function (resp) {
                  callHubDeleteLibrary(resp.data.users);
                });
              } else if (vm.conf.module === vm.modules.SYMPTOM) {
                model = {
                  symptomIds: vm.listModel.itemsChecked
                };
                symptomFactory.getUsersOfSymptom(model).then(function (resp) {
                  callHubDeleteLibrary(resp.data.users);
                });
              } else if (vm.conf.module === vm.modules.POTENTIAL_CAUSE) {
                model = {
                  potentialCauseIds: vm.listModel.itemsChecked
                };
                potentialCauseFactory.getUsersOfPotentialCause(model).then(function (resp) {
                  callHubDeleteLibrary(resp.data.users);
                });
              }
            });
          }
        }

        /**
         * filter symptoms belong to selected line, machine and component
         */
        function getSymptom() {
          var param = {
            lineIds: vm.listModel.lineId,
            machineIds: vm.listModel.machineId,
            componentIds: vm.listModel.componentId
          };
          commonFactory.getCommonSymptom(param).then(function (resp) {
            vm.symptomList = resp.data;
          });
          vm.search();
        }

        /**
         * filter lines belong to selected area in machine module
         */
        function getLines() {
          var param = {
            areaId: vm.listModel.areaId
          };
          commonFactory.getCommonLine(param).then(function (resp) {
            vm.lineList = resp.data;
          });
          vm.listModel.lineId = null;
          vm.search();
        }

        /**
         * filter lines belong to selected area in component module
         */
        function getComponentLines() {
          var param = {
            areaId: vm.listModel.areaId
          };
          commonFactory.getCommonLine(param).then(function (resp) {
            vm.lineList = resp.data;
          });
          vm.listModel.lineId = null;
          vm.listModel.machineId = null;
          vm.search();
        }

        /**
         * filter machines belong to selected area and selected line in component module
         */
        function getComponentMachines() {
          if (vm.listModel.lineId && vm.listModel.areaId) {
            var param = {
              lineId: vm.listModel.lineId
            };
            commonFactory.getCommonMachine(param).then(function (resp) {
              vm.machineList = resp.data;
            });
            vm.listModel.machineId = null;
          }
          vm.search();
          getSymptom();
        }

        /**
         * filter lines belong to selected area in symptom module
         */
        function getSymptomLines() {
          var param = {
            areaId: vm.listModel.areaId
          };
          commonFactory.getCommonLine(param).then(function (resp) {
            vm.lineList = resp.data;
          });
          vm.listModel.lineId = null;
          vm.listModel.machineId = null;
          vm.listModel.componentId = null;
          vm.machineList = [];
          vm.componentList = [];
          vm.search();
        }

        /**
         * filter machines belong to selected area and selected line in symptom module
         */
        function getSymptomMachines() {
          if (vm.listModel.lineId && vm.listModel.areaId) {
            var param = {
              lineId: vm.listModel.lineId
            };
            commonFactory.getCommonMachine(param).then(function (resp) {
              vm.machineList = resp.data;
            });
            vm.listModel.machineId = null;
            vm.listModel.componentId = null;
            vm.componentList = [];
          }
          vm.search();
          getSymptom();
        }

        /**
         * filter components belong to selected area, line and machine in symptom module
         */
        function getSymptomComponents() {
          if (vm.listModel.lineId && vm.listModel.areaId && vm.listModel.machineId) {
           var param = {
              machineId: vm.listModel.machineId
            };
            commonFactory.getCommonComponent(param).then(function (resp) {
              vm.componentList = resp.data;
            });
            vm.listModel.componentId = null;
          }
          vm.search();
          getSymptom();
        }

        /**
         * filter potentical cause belong to selected symptom in troubleshoot module
         */
        function getPotentialCause() {
          var param = {
            symptomIds: vm.listModel.symptomId
          };
          commonFactory.getCommonPotentialCause(param).then(function (resp) {
            vm.potentialCauseList = resp.data;
          });
          vm.listModel.potentialCauseId = null;
          vm.search();
        }

        vm.storageFilter = JSON.parse(sessionStorage.getItem('currentFilter'));
        vm.conf = vm.conf || {};
        vm.cols = vm.conf.cols;
        vm.conf.commonData = vm.conf.commonData || {};
        vm.defaultOptions = angular.extend({
          page: 1,
          count: 10,
          sorting: {
            id: 'desc'
          },
          getData: getData
        }, vm.conf);

        vm.tableParams = new NgTableParams({
          page: vm.storageFilter ? vm.storageFilter.numPage : vm.defaultOptions.page,
          count: vm.storageFilter ? vm.storageFilter.pageSize : vm.defaultOptions.count,
          sorting: vm.conf.sorting ? vm.conf.sorting : vm.defaultOptions.sorting
        },{
          getData: vm.defaultOptions.getData
        });

        vm.modules = angular.fromJson(moduleList);
        vm.shootingStatus = angular.fromJson(shootingStatus);
        vm.issueStatus = angular.fromJson(issueStatus);

        vm.defaultListModel = {
          isCheckAllItems: false,
          itemsChecked: []
        };

        vm.listModel = vm.conf.listModel ? vm.conf.listModel : vm.defaultListModel;
        
        if($state.includes('app.issueDashboard')) {
          vm.listModel.notHaveTrouble = true;
        }
        else if($state.includes('app.issueOpenDashboard')) {
          vm.listModel.listStatus = '0';
        }
        else if($state.includes('app.issueCloseDashboard')) {
          vm.listModel.listStatus = '5';
        }
        else if($state.includes('app.issue')) {
          vm.listModel.listStatus = '';
        }

        if($state.includes('app.troubleMyShootingDashboard')) {
          vm.listModel.isOnlyMe = true;
          vm.listModel.listStatus = '';
        }
        else if($state.includes('app.troublePublicDashboard')) {
          vm.listModel.listStatus = '2';
        }
        else if($state.includes('app.troubleRejectedDashboard')) {
          vm.listModel.listStatus = '3';
        }
        else if($state.includes('app.troubleNotConfirmDashboard')) {
          vm.listModel.listStatus = ['0','1','3'];
        }
        else if($state.includes('app.troubleNeedConfirmDashboard')) {
          vm.listModel.listStatus = '1';
        }
        else if($state.includes('app.troubleshoot')) {
          vm.listModel.listStatus = '';
        }

        //$interval(function () {
        //    if (vm.conf.module === 'opc_viewer') {
        //        getData();
        //    }

        //}, 5000);

        vm.indeterminate = false;
        vm.keyword = "";
        vm.isCollapsed = true;
        vm.isActive = $state.includes('app.troubleMyShootingDashboard') ? null : true;
        vm.permission = userContext.getPermissions();
        vm.roleList = angular.fromJson(role);
        vm.currentUser = $rootScope.currentUserInfo;
        vm.currentUser.areas = _.map(vm.currentUser.areas,'id');

        vm.search = search;
        vm.checkAll = checkAll;
        vm.checkItem = checkItem;
        vm.viewDetail = viewDetail;
        vm.remove = remove;
        vm.deleteInactiveItem = deleteInactiveItem;

        vm.getLines = getLines;
        vm.getComponentLines = getComponentLines;
        vm.getComponentMachines = getComponentMachines;
        vm.getSymptomLines = getSymptomLines;
        vm.getSymptomMachines = getSymptomMachines;
        vm.getSymptomComponents = getSymptomComponents;
        vm.getSymptom = getSymptom;
        vm.getPotentialCause = getPotentialCause;

        initData(vm.conf.module);
      }

      return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'cNgTableTpl.html',
        link: linkFn,
        scope: {
          conf: '=',
          instance: '='
        },
        controller: ['$scope',
          ctrlFn
        ],
        controllerAs: 'vm',
        bindToController: true
      };
    }]);
  return module.name;
});
