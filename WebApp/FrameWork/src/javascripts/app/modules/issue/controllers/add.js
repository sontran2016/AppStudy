define(function (require) {
  'use strict';
  var angular = require('angular'),
    moment = require('moment'),
    _ = require('lodash');
  var controller = [
    '$state',
    '$q',
    'userContext',
    'issueFactory',
    'data',
    '$uibModal',
    'moment',
    'signalRFactory',
    'user',
    'symptomFactory',
    'potentialCauseFactory',
    'troubleshootFactory',
    'shootingFactory',
    'commonFactory',
    function ($state,
      $q,
      userContext,
      issueFactory,
      data,
      $uibModal,
      moment,
      signalRFactory,
      user,
      symptomFactory,
      potentialCauseFactory,
      troubleshootFactory,
      shootingFactory,
      commonFactory) {

      var vm = this;

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
        if(vm.issueModel.machineId) {
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
      }

      function setMachineDataSource() {
        if(vm.issueModel.lineId) {
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
      }

      function setLineDataSource() {
        if(vm.issueModel.areaId) {
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
      }

      /**
       * filter component belong to selected machine
       */
      function filterComponent() {
        vm.issueModel.componentId = '';
        setComponentDataSource();
      }

      /**
       * filter machine belong to selected line
       */
      function filterMachine() {
        vm.issueModel.machineId = '';
        vm.issueModel.componentId = '';
        setMachineDataSource();
        setComponentDataSource();
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
       * Add new issue
       */
      function addIssue() {
        var data = {
          title: vm.shortName + '-' + vm.issueModel.title,
          description: vm.issueModel.description,
          componentId: vm.issueModel.componentId ? vm.issueModel.componentId : '',
          machineId: vm.issueModel.machineId ? vm.issueModel.machineId : '',
          areaId: vm.issueModel.areaId ? vm.issueModel.areaId : '',
          lineId: vm.issueModel.lineId ? vm.issueModel.lineId : '',
          isdds: false,
          isActive: true,
          status: 0,
          timestamp: moment(vm.issueModel.timestamp, 'DD-MM-YYYY hh:mm A').format(),
          potentialCauses: vm.potentialCauseList
        };

        issueFactory.addNew(data).then(function (resp) {
          vm.issueModel.id = resp.data.id;
          vm.potentialCauseList[0].id = resp.data.potentialCauses[0].id;

          var param = {
            id: resp.data.id,
            lineId: resp.data.line.id,
            message: resp.data.title
          };
          signalRFactory.issueHub.addNewIssue(param);
        });
      }

      function addSymptom() {
        var model = {
          description: vm.symptomDescription,
          lineIds: vm.issueModel.lineId.toString(),
          machineIds: vm.issueModel.machineId.toString(),
          componentIds: vm.issueModel.componentId.toString(),
          isActive: true
        };
        symptomFactory.addNew(model).then(function (resp) {
          vm.symptomId = resp.data.id;
          _.forEach(vm.potentialCauseList, function (obj) {
            obj.symptomId = vm.symptomId;
          });
          addIssue();
        });
      }

      /**
       * Add a new potential cause to list
       */
      function addPotentialCause() {
        var item = {
          description: '',
          symptomId: vm.symptomId,
          issueId: vm.issueModel.id || '',
          isActive: true
        };
        vm.potentialCauseList.push(item);
      }

      function removePotentialCause(potentialCause) {
        _.remove(vm.potentialCauseList, potentialCause);
      }

      function createPotentialCause(potentialCause) {
        potentialCause.issueId = vm.issueModel.id;
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
        if (!vm.issueModel.id) {
          addSymptom();
        } else {
          if (potentialCause.id) {
            potentialCause.issueId = vm.issueModel.id;
            potentialCause.isUpdateDescription = true;
            updatePotentialCause(potentialCause);
          } else {
            createPotentialCause(potentialCause);
          }
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
          resp.data.shootings = [];
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


      vm.issueModel = {
        "title": '',
        "description": '',
        "areaId": '',
        "lineId": '',
        "machineId": '',
        "componentId": '',
        "potentialCauses": '',
        "timestamp": moment().format('DD-MM-YYYY hh:mm A')
      };

      vm.potentialCauseList = [];
      vm.permission = userContext.getPermissions();
      vm.userAreas = _.map(user.areas, 'id');
      vm.userLines = _.map(user.lines, 'id');
      vm.userMachines = _.map(user.machines, 'id');

      vm.areaList = _.filter(data, function (obj) {
        return _.indexOf(vm.userAreas, obj.id) > -1;
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
      vm.getShortName = getShortName;

    }];
  return controller;
});
