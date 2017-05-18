define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    '$scope',
    'userContext',
    '$q',
    'issueFactory',
    'issueModel',
    '$translate',
    '$state',
    'dataArea',
    'dataLine',
    'dataMachine',
    'dataComponent',
    '$uibModal',
    'moment',
    'commonFactory',
    'signalRFactory',
    'potentialCauseFactory',
    'symptomFactory',
    'troubleshootFactory',
    'shootingFactory',
    'user',
    'notifications',
    function ($scope,
      userContext,
      $q,
      issueFactory,
      issueModel,
      $translate,
      $state,
      dataArea,
      dataLine,
      dataMachine,
      dataComponent,
      $uibModal,
      moment,
      commonFactory,
      signalRFactory,
      potentialCauseFactory,
      symptomFactory,
      troubleshootFactory,
      shootingFactory,
      user,
      notifications) {

      var vm = this;

      /**
       * update issue
       */
      function saveIssue() {
        if (vm.issueModel.title && vm.issueModel.areaId && vm.issueModel.lineId && vm.issueModel.machineId && vm.issueModel.componentId) {
          getShortName();
          var model = {
            "title": vm.shortName + '-' + vm.subTitle,
            "description": vm.issueModel.description,
            "componentId": vm.issueModel.componentId ? vm.issueModel.componentId : '',
            "machineId": vm.issueModel.machineId ? vm.issueModel.machineId : '',
            "areaId": vm.issueModel.areaId ? vm.issueModel.areaId : '',
            "lineId": vm.issueModel.lineId ? vm.issueModel.lineId : '',
            "isdds": false,
            "isActive": vm.issueModel.isActive,
            "status": vm.issueModel.status.id,
            "timestamp": moment(vm.issueModel.timestamp, 'DD-MM-YYYY hh:mm A').format(),
            "potentialCauses": _.map(vm.potentialCauseList, 'id').toString()
          };
          issueFactory.updateInfo(vm.issueModel.id, model).then(function (resp) {
            vm.issueModel = resp.data;
            vm.issueModel.timestamp = moment(resp.data.timestamp).format('DD-MM-YYYY hh:mm A');
            vm.issueModel.areaId = resp.data.area.id;
            vm.issueModel.lineId = resp.data.line.id;
            vm.issueModel.machineId = resp.data.machine ? resp.data.machine.id : '';
            vm.issueModel.componentId = resp.data.component ? resp.data.component.id : '';

            var lineIds = vm.issueModel.lineId;
            var param = {
              lineIds: lineIds
            };
            signalRFactory.issueHub.deleteIssue(param);
          });
        }
      }

      function getShortName() {
        var selectArea = _.find(vm.areaList, function (obj) {
          return obj.id === vm.issueModel.areaId;
        });

        var selectLine = _.find(vm.lineList, function (obj) {
          return obj.id === vm.issueModel.lineId;
        });

        var selectMachine = _.find(vm.machineList, function (obj) {
          return obj.id === vm.issueModel.machineId;
        });

        var selectComponent = _.find(vm.componentList, function (obj) {
          return obj.id === vm.issueModel.componentId;
        });

        var shortNameArea = selectArea && selectArea.shortName ? selectArea.shortName : '';
        var shortNameLine = selectLine && selectLine.shortName ? '-' + selectLine.shortName : '';
        var shortNameMachine = selectMachine && selectMachine.shortName ? '-' + selectMachine.shortName : '';
        var shortNameComponent = selectComponent && selectComponent.shortName ? '-' + selectComponent.shortName : '';        

        if (selectComponent && selectComponent.id !== '0') {
          vm.shortName = shortNameArea + shortNameLine + shortNameMachine + '-' + selectComponent.name;
        } else if (selectMachine && selectMachine.id !== '0') {
          vm.shortName = shortNameArea + shortNameLine + '-' + selectMachine.name;
        } else if (selectLine) {
          vm.shortName = shortNameArea + '-' + selectLine.name;
        } else if (selectArea) {
          vm.shortName = selectArea.name;
        }
      }

      function setComponentDataSource() {
        var param = {
          machineId: vm.issueModel.machineId
        };
        commonFactory.getCommonComponent(param).then(function (resp) {
          vm.componentList = resp.data;

          vm.componentList.push({
            id: '0',
            name: 'Other'
          });
          getShortName();
        }); 
      }

      function setMachineDataSource() {
        var param = {
          lineId: vm.issueModel.lineId
        };
        commonFactory.getCommonMachine(param).then(function (resp) {
          vm.machineList = _.filter(resp.data, function (obj) {
            return _.indexOf(vm.userMachines, obj.id) > -1;
          });
          vm.machineList.push({
            id: '0',
            name: 'Other'
          });
          getShortName();
        });
      }

      function setLineDataSource() {
        var param = {
          areaId: vm.issueModel.areaId
        };
        commonFactory.getCommonLine(param).then(function (resp) {
          vm.lineList = _.filter(resp.data, function (obj) {
            return _.indexOf(vm.userLines, obj.id) > -1;
          });
          getShortName();
        });
      }

      /**
       * filter component belong to selected machine
       */
      function filterComponent() {
        vm.issueModel.componentId = '';
        setComponentDataSource();
        saveIssue();
      }

      /**
       * filter machine belong to selected line
       */
      function filterMachine() {
        vm.issueModel.machineId = '';
        vm.issueModel.componentId = '';
        setMachineDataSource();
        setComponentDataSource();
        saveIssue();
      }

      /**
       * filter line belong to selected area
       */
      function filterLine() {
        vm.issueModel.lineId = '';
        vm.issueModel.machineId = '';
        vm.issueModel.componentId = '';
        setLineDataSource();
        setMachineDataSource();
        setComponentDataSource();
      }

      /**
       * close issue
       */
      function closeIssue() {
        issueFactory.close(vm.issueModel.id).then(function (resp) {
          $state.go('app.issueDetails', { id: resp.data.id });

          var param = {
            issueId: resp.data.id,
            message: resp.data.title
          };
          signalRFactory.issueHub.closeMessage(param);
        });
      }

      function updateSymptom() {
        var model = {
          id: vm.symptomId,
          description: vm.symptomDescription,
        };
        symptomFactory.updateDescription(model).then(function (resp) {
          vm.symptomDescription = resp.data.description;
        });
      }

      function addPotentialCause() {
        var item = {
          description: '',
          symptomId: vm.symptomId,
          issueId: vm.issueModel.id,
          isActive: true
        };
        vm.potentialCauseList.push(item);
      }

      function removePotentialCause(potentialCause) {
        _.remove(vm.potentialCauseList, potentialCause);
      }

      function createPotentialCause(potentialCause) {
        potentialCauseFactory.addNew(potentialCause).then(function (resp) {
          potentialCause.id = resp.data.id;
        });
      }

      function updatePotentialCause(potentialCause) {
        potentialCauseFactory.updateInfo(potentialCause).then(function (resp) {
          vm.potentialCauseList[_.findIndex(vm.potentialCauseList, function (item) {
            return item.id === resp.data.id;
          })] = {
              id: resp.data.id,
              description: resp.data.description,
              symptomId: resp.data.symptomId,
              issueId: resp.data.issue.id,
              isActive: true,
              trouble: potentialCause.trouble
            };
        });
      }

      function savePotentialCause(potentialCause) {
        if (potentialCause.id) {
          potentialCause.isUpdateDescription = true;
          updatePotentialCause(potentialCause);
        } else {
          createPotentialCause(potentialCause);
        }
      }

      function deletePotentialCause(potentialCause) {
        potentialCauseFactory.removeItems(potentialCause.id).then(function () {
          _.remove(vm.potentialCauseList, potentialCause);

          if (!vm.potentialCauseList.length) {
            $state.go('app.issue');

            var param = {
              lineIds: vm.issueModel.line.id
            };
            signalRFactory.issueHub.deleteIssue(param);
          }
        });
      }

      function addTroubleshoot(potentialCause) {
        var model = {
          title: vm.issueModel.title + ' - ' + potentialCause.description,
          description: vm.issueModel.description,
          isdds: true,
          potentialCauseIds: potentialCause.id,
          resourceIds: '',
          tagIds: '',
          isActive: true,
          lineId: vm.issueModel.lineId,
          issueId: vm.issueModel.id
        };
        troubleshootFactory.addNew(model).then(function (resp) {
          vm.potentialCauseList[_.findIndex(vm.potentialCauseList, function (item) {
            return item.id === potentialCause.id;
          })].trouble = resp.data;

          if(!resp.data.isReactive) {
            var shootingModel = {
              troubleId: resp.data.id,
              isActive: true,
              resourceId: '',
              version: ''
            };
            shootingFactory.addNew(shootingModel).then(function (shootingResp) {
              var modalInstance = $uibModal.open({
                templateUrl: 'issue/templates/modal/addShooting.html',
                controller: 'AddShootingController',
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                  data: {
                    troubleshootModel: resp.data,
                    shootingModel: shootingResp.data,
                    potentialCauseId: potentialCause.id
                  }
                }
              });

              modalInstance.result.then(function (resp) {
                vm.potentialCauseList[_.findIndex(vm.potentialCauseList, function (item) {
                    return item.id === potentialCause.id;
                  })].trouble = resp.troubleshootModel;

                vm.potentialCauseList[_.findIndex(vm.potentialCauseList, function (item) {
                  return item.id === potentialCause.id;
                })].trouble.shootings === null ? [] : vm.potentialCauseList[_.findIndex(vm.potentialCauseList, function (item) {
                  return item.id === potentialCause.id;
                })].trouble.shootings[0] = resp.shootingModel ? resp.shootingModel : null;

                if(!resp.shootingModel) {
                  vm.potentialCauseList[_.findIndex(vm.potentialCauseList, function (item) {
                    return item.id === potentialCause.id;
                  })].trouble.shootings === null ? [] : vm.potentialCauseList[_.findIndex(vm.potentialCauseList, function (item) {
                    return item.id === potentialCause.id;
                  })].trouble.shootings = null;
                }
              });
            });
          } else {
            var modalInstance = $uibModal.open({
                templateUrl: 'issue/templates/modal/addShooting.html',
                controller: 'AddShootingController',
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                  data: {
                    troubleshootModel: resp.data,
                    shootingModel: resp.data.shootings[0],
                    potentialCauseId: potentialCause.id
                  }
                }
              });

              modalInstance.result.then(function (resp) {
                vm.potentialCauseList[_.findIndex(vm.potentialCauseList, function (item) {
                    return item.id === potentialCause.id;
                  })].trouble = resp.troubleshootModel;

                vm.potentialCauseList[_.findIndex(vm.potentialCauseList, function (item) {
                  return item.id === potentialCause.id;
                })].trouble.shootings === null ? [] : vm.potentialCauseList[_.findIndex(vm.potentialCauseList, function (item) {
                  return item.id === potentialCause.id;
                })].trouble.shootings[0] = resp.shootingModel ? resp.shootingModel : null;

                if(!resp.shootingModel) {
                  vm.potentialCauseList[_.findIndex(vm.potentialCauseList, function (item) {
                    return item.id === potentialCause.id;
                  })].trouble.shootings === null ? [] : vm.potentialCauseList[_.findIndex(vm.potentialCauseList, function (item) {
                    return item.id === potentialCause.id;
                  })].trouble.shootings = null;
                }
              });
          }
        });
      }

      function getShooting(trouble) {
        var deferred = $q.defer();
        troubleshootFactory.getDetails(trouble.id).then(function (resp) {
          if(resp.data.shootings && resp.data.shootings.length) {
            deferred.resolve(resp.data.shootings[resp.data.shootings.length - 1]);
          } else {
            var shootingModel = {
              troubleId: trouble.id,
              isActive: true,
              resourceId: '',
              version: ''
            };
            shootingFactory.addNew(shootingModel, false).then(function (shootingResp) {
              deferred.resolve(shootingResp.data);
            });
          }
        });
        return deferred.promise;
      }

      function viewTroubleshoot(potentialCause) {
        getShooting(potentialCause.trouble).then(function (resp) {
          var modalInstance = $uibModal.open({
            templateUrl: 'issue/templates/modal/viewShooting.html',
            controller: 'ViewShootingController',
            controllerAs: 'vm',
            backdrop: 'static',
            size: 'lg',
            resolve: {
              data: {
                troubleshootModel: potentialCause.trouble,
                shootingModel: resp,
                canAction: true,
                potentialCauseId: potentialCause.id
              }
            }
          });

          modalInstance.result.then(function (resp) {
            vm.potentialCauseList[_.findIndex(vm.potentialCauseList, function (item) {
                  return item.id === potentialCause.id;
                })].trouble = resp.troubleshootModel;

            vm.potentialCauseList[_.findIndex(vm.potentialCauseList, function (item) {
              return item.id === potentialCause.id;
            })].trouble.shootings === null ? [] : vm.potentialCauseList[_.findIndex(vm.potentialCauseList, function (item) {
              return item.id === potentialCause.id;
            })].trouble.shootings[0] = resp.shootingModel ? resp.shootingModel : null;

            if(!resp.shootingModel) {
              vm.potentialCauseList[_.findIndex(vm.potentialCauseList, function (item) {
                return item.id === potentialCause.id;
              })].trouble.shootings === null ? [] : vm.potentialCauseList[_.findIndex(vm.potentialCauseList, function (item) {
                return item.id === potentialCause.id;
              })].trouble.shootings = null;
            }
          });
        });
      }

      /* reload page when receiving a issue notification */
      notifications.onIssueCountChanged($scope, function (args) {
        if(args.data.TargetId === vm.issueModel.id) {
          var modalInstance = $uibModal.open({
            templateUrl: 'common/templates/notifyChanged.html',
            controller: 'NotifyChangedIssueController',
            controllerAs: 'vm',
            backdrop: 'static',
            keyboard: false,
            windowClass: 'notify-modal',
            size: 'lg',
            resolve: {
              type: function () {
                return 'issue';
              }
            }
          });
        }
      });

      vm.potentialCauseList = [];
      vm.permission = userContext.getPermissions();
      vm.userAreas = _.map(user.areas, 'id');
      vm.userLines = _.map(user.lines, 'id');
      vm.userMachines = _.map(user.machines, 'id');

      vm.areaList = _.filter(dataArea, function (obj) {
        return _.indexOf(vm.userAreas, obj.id) > -1;
      });
      vm.lineList = _.filter(dataLine, function (obj) {
        return _.indexOf(vm.userLines, obj.id) > -1;
      });
      vm.machineList = _.filter(dataMachine, function (obj) {
        return _.indexOf(vm.userMachines, obj.id) > -1;
      });
      vm.componentList = dataComponent;

      vm.machineList.push({
        id: '0',
        name: 'Other'
      });

      vm.componentList.push({
        id: '0',
        name: 'Other'
      });

      vm.issueModel = angular.copy(issueModel);
      vm.issueModel.timestamp = moment(vm.issueModel.timestamp).format('DD-MM-YYYY hh:mm A');
      vm.issueModel.areaId = vm.issueModel.area.id;
      vm.issueModel.lineId = vm.issueModel.line.id;
      vm.issueModel.machineId = vm.issueModel.machine ? vm.issueModel.machine.id : '';
      vm.issueModel.componentId = vm.issueModel.component ? vm.issueModel.component.id : '';

      if (vm.issueModel.component && vm.issueModel.component.id !== '0') {
        vm.shortName = vm.issueModel.area.shortName + '-' + vm.issueModel.line.shortName + '-' + vm.issueModel.machine.shortName + '-' + vm.issueModel.component.name;  
      } else if (vm.issueModel.machine && vm.issueModel.machine.id !== '0') {
        vm.shortName = vm.issueModel.area.shortName + '-' + vm.issueModel.line.shortName + '-' + vm.issueModel.machine.name;
      } else if (vm.issueModel.line) {
        vm.shortName = vm.issueModel.area.shortName + '-' + vm.issueModel.line.name;
      } else if(vm.issueModel.area) {
        vm.shortName = vm.issueModel.area.name;
      }

      var indexShortName = vm.issueModel.title.search(vm.shortName);
      var endIndexShortName = indexShortName + vm.shortName.length;
      vm.subTitle = vm.issueModel.title.substring(endIndexShortName + 1);

      vm.areaIdtmp = vm.issueModel.area.id;
      vm.lineIdtmp = vm.issueModel.line.id;
      vm.machineIdtmp = vm.issueModel.machine ? vm.issueModel.machine.id : '';
      vm.componentIdtmp = vm.issueModel.component ? vm.issueModel.component.id : '';
      vm.symptomDescription = vm.issueModel.symptom.description;
      vm.symptomId = vm.issueModel.symptom.id;

      _.forEach(vm.issueModel.potentialCauses, function (obj) {
        var item = {
          id: obj.id,
          description: obj.description,
          symptomId: vm.symptomId,
          trouble: obj.trouble,
          issueId: vm.issueModel.id,
          isActive: true
        };
        vm.potentialCauseList.push(item);
      });

      vm.filterLine = filterLine;
      vm.filterMachine = filterMachine;
      vm.filterComponent = filterComponent;
      vm.addPotentialCause = addPotentialCause;
      vm.removePotentialCause = removePotentialCause;
      vm.savePotentialCause = savePotentialCause;
      vm.deletePotentialCause = deletePotentialCause;
      vm.addTroubleshoot = addTroubleshoot;
      vm.viewTroubleshoot = viewTroubleshoot;
      vm.closeIssue = closeIssue;
      vm.updateSymptom = updateSymptom;
      vm.saveIssue = saveIssue;

      setLineDataSource();
      setMachineDataSource();
      setComponentDataSource();

    }];
  return controller;
});
