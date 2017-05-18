define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    '$state',
    '$translate',
    '$uibModalInstance',
    'userModel',
    'data',
    function ($state,
              $translate,
              $uibModalInstance,
              userModel,
              data) {

      var vm = this;

      /**
       * select or unselect all item
       */
      function selectAll() {
        if(vm.selectedAll) {
          _.forEach(vm.itemList, function (item) {
            item.selected = true;
            if(_.indexOf(vm.selectedItems, item) < 0) {
              vm.selectedItems.push(item);
            }
          });
        } else {
          _.forEach(vm.itemList, function (item) {
            item.selected = false;
            vm.selectedItems = [];
          });
        }
      }

      /**
       * select or unselect an item
       * @param item
       */
      function selectItem(item) {
        if(item.selected && _.indexOf(vm.selectedItems, item) < 0) {
          vm.selectedItems.push(item);
        } else {
          _.remove(vm.selectedItems, function (obj) {
            return obj.id === item.id;
          });
        }

        vm.selectedAll = vm.selectedItems.length === vm.items.length ? true : false;
      }

      /**
       * filter list by keyword
       */
      function filterList() {
        if(vm.keyword) {
          vm.itemList = _.filter(vm.items, function (item) {
            return item.name.toLowerCase().includes(vm.keyword) === true;
          });
        } else {
          vm.itemList = vm.items;
        }
      }

      /**
       * set choosen area to user
       */
      function setChoosenArea() {
        $uibModalInstance.close(vm.selectedItems);
      }

      /**
       * Close modal
       */
      function close() {
        $uibModalInstance.dismiss('cancel');
      }

      vm.items = angular.copy(data);
      vm.itemList = angular.copy(vm.items);
      vm.userModel = angular.copy(userModel);
      vm.selectedItems = [];

      if(vm.userModel.areaIds.length) {
        _.forEach(vm.itemList, function (item) {
          if(_.indexOf(_.map(vm.userModel.areaIds, 'id'), item.id) !== -1) {
            item.selected = true;
            vm.selectedItems.push(item);
          } else {
            item.selected = false;
          }
        });

        _.forEach(vm.items, function (item) {
          if(_.indexOf(_.map(vm.userModel.areaIds, 'id'), item.id) !== -1) {
            item.selected = true;
          } else {
            item.selected = false;
          }
        });

        if(vm.selectedItems.length === vm.items.length) {
          vm.selectedAll = true;
        }
      }

      vm.selectAll = selectAll;
      vm.selectItem = selectItem;
      vm.filterList = filterList;
      vm.close = close;
      vm.setChoosenArea = setChoosenArea;

    }];
  return controller;
});
