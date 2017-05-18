define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var typeFile = angular.fromJson(require('text!app/common/resources/common/fileType.json'));
  var controller = [
    '$state',
    'appConstant',
    'troubleshootFactory',
    'potentialCauseFactory',
    'fileFactory',
    'tag',
    '$uibModal',
    '$translate',
    'symptomFactory',
    'tagFactory',
    'signalRFactory',
    'notifications',
    'user',
    function ($state,
              appConstant,
              troubleshootFactory,
              potentialCauseFactory,
              fileFactory,
              tag,
              $uibModal,
              $translate,
              symptomFactory,
              tagFactory,
              signalRFactory,
              notifications,
              user) {

      var vm = this;

      /**
       * get list potential cause by symptom id
       */
      function getPotentialCauses(symptomId) {
        potentialCauseFactory.getAll(symptomId).then(function (resp) {
          vm.potentialCauses = resp.data.potentialCauses;
        });
      }

      /**
       * choose symptom item
       */
      function chooseSymptom() {
        var modalInstance = $uibModal.open({
          templateUrl: 'symptom/templates/modal/selectSymptom.html',
          controller: 'ModalSelectSymptomController',
          controllerAs: 'vm',
          backdrop: 'static',
          size: 'lg',
          resolve: {
            symptomAddModel: vm.addModel,
            data: [
              '$q',
              'commonFactory',
              function ($q,
                        commonFactory) {
                var deferred = $q.defer();

                var params = {
                  isArea: true,
                  isLine: true,
                  isMachine: true,
                  isComponent: true
                };

                commonFactory.getFilterCommonData(params).then(function (resp) {
                  deferred.resolve(resp.data);
                }, function () {
                  deferred.reject();
                });
                return deferred.promise;
              }],
            symptomResponse: [
              '$q',
              'symptomFactory',
              function($q, symptomFactory){
                var deferred = $q.defer();

                var params = {
                  orderBy: function() {
                    return ['-id'];
                  },
                  page: function() {
                    return 1;
                  },
                  count: function() {
                    return 10;
                  },
                  areaIds: user.role === 'user' ? _.map(user.areas,'id').join(',') : null,
                  lineIds: user.role === 'user' ? _.map(user.lines,'id').join(',') : null,
                  machineIds: user.role === 'user' ? _.map(user.machines,'id').join(',') : null
                };

                symptomFactory.getSymptomList(params, '').then(function (resp) {
                  deferred.resolve(resp.data);
                }, function () {
                  deferred.reject();
                });
                return deferred.promise;
            }]
          }
        });

        modalInstance.result.finally(function() {
          getPotentialCauses(vm.addModel.symptomId);

          if(vm.addModel.symptomName){
            vm.addModel.isSelectSymptom = true;
            vm.addModel.symptomSelected = vm.addModel.symptomName;

            vm.addModel.potentialSelected =  $translate.instant('TROUBLESHOOT.NO_POTENTIAL');
            vm.addModel.potentialCauseId = "";
            vm.addModel.potentialCauseName = "";
          }
          else{
            vm.addModel.isSelectSymptom = false;
          }
        });
      }

      /**
       * choose potential item
       */
      function choosePotential() {
        var modalInstance = $uibModal.open({
          templateUrl: 'potentialCause/templates/modal/selectPotential.html',
          controller: 'ModalSelectPotentialController',
          controllerAs: 'vm',
          backdrop: 'static',
          size: 'lg',
          resolve: {
            potentialAddModel: vm.addModel,
            data: [
              '$q',
              'commonFactory',
              function ($q,
                        commonFactory) {
                var deferred = $q.defer();

                var params = {
                  isSymptom: true
                };

                commonFactory.getFilterCommonData(params).then(function (resp) {
                  deferred.resolve(resp.data);
                }, function () {
                  deferred.reject();
                });
                return deferred.promise;
              }],
            potentialResponse: [
              '$q',
              'potentialCauseFactory',
              function($q, potentialCauseFactory){
                var deferred = $q.defer();

                var params = {
                  orderBy: function() {
                    return ['-id'];
                  },
                  page: function() {
                    return 1;
                  },
                  count: function() {
                    return 10;
                  },
                  symptomId: vm.addModel.symptomId
                };

                potentialCauseFactory.getPotentialCauseList(params, '').then(function (resp) {
                  deferred.resolve(resp.data);
                }, function () {
                  deferred.reject();
                });
                return deferred.promise;
              }]
          }
        });

        modalInstance.result.finally(function() {
          if(vm.addModel.potentialCauseName){
            vm.addModel.isSelectPotential = true;
            vm.addModel.potentialSelected = vm.addModel.potentialCauseName;
          }
          else{
            vm.addModel.isSelectPotential = false;
          }
        });
      }

      /**
       * Upload file
       * @param file
       */
      function uploadFile() {
        if (!vm.files) {
          return;
        }

        fileFactory.upload(vm.files, typeFile.TROUBLESHOOT).then(function (resp) {
          vm.addModel.resourceIds.push(resp.data.fileId);
          vm.resources.push(resp.data);
          vm.files = [];
        });
      }

      /**
       * Remove uploaded file
       * @param file
       */
      function removeFile(file) {
        _.remove(vm.resources, file);
        _.remove(vm.addModel.resourceIds, file.fileId);
      }

      /**
       * Add new troubleshoot
       */
      function save() {
        troubleshootFactory.addNew(vm.addModel).then(function (resp) {
          if (vm.addAnother) {
            vm.addModel = angular.copy(vm.addModelBak);
            vm.resources = [];
            vm.formAdd.$setPristine();
          }
          else{
            $state.go('app.troubleshootDetails', {id: resp.data.id});
          }

          notifications.troubleCountChanged({
            data: resp.data
          });
        });
      }

      /**
       * Add new tag when input in dropdown list tag
       */
      function addNewTag(tagName) {
        var tagModel = {
          "name": tagName,
          "description": "",
          "isActive": true
        };

        tagFactory.addNew(tagModel).then(function (resp) {
          vm.tags.unshift(resp.data);
          vm.addModel.tagIds.push(resp.data.id);
        });
      }

      vm.tags = tag.tags;

      vm.addModelBak = {
        "title": "",
        "description": "",
        "isdds": true,
        "isActive": true,
        "symptomId": "",
        "symptomName": "",
        "symptomSelected": $translate.instant('TROUBLESHOOT.NO_SYMPTOM'),
        "potentialSelected": $translate.instant('TROUBLESHOOT.NO_POTENTIAL'),
        "potentialCauseId": "",
        "potentialCauseName": "",
        "resourceIds": [],
        "tagIds": []
      };

      vm.addModel = angular.copy(vm.addModelBak);
      vm.resources = [];

      vm.uploadFile = uploadFile;
      vm.removeFile = removeFile;
      vm.save = save;
      vm.chooseSymptom = chooseSymptom;
      vm.choosePotential = choosePotential;
      vm.addNewTag = addNewTag;
      vm.getSrc = fileFactory.getSrc;
      vm.getFileExtension = fileFactory.getFileExtension;
      vm.getFileType = fileFactory.getFileType;

    }];
  return controller;
});
