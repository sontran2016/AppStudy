define(function (require) {
  'use strict';

  // Load change area module
  var router = require('uiRouter'),
    angularTranslate = require('angularTranslate'),
    ngTable = require('ngTable'),
    angularTranslateLoaderPartial = require('angularTranslateLoaderPartial'),
    angular = require('angular'),
    app = require('app/modules/area/area'),
    itemsResponse = angular.fromJson(require('text!./../../../data/area/items.json')),

    createController,
    $translateSpied,
    areaFactorySpied,
    NgTableParams,
    vm, $scope,
    $q;

  describe('Area List Controller', function () {
    // Inject common modules
    beforeEach(module('ui.router'));
    beforeEach(module('pascalprecht.translate'));
    beforeEach(module('ngTable'));

    // Inject change password module
    beforeEach(module('app.area'));

    beforeEach(function () {
      inject(function ($controller,
                       $rootScope,
                       _NgTableParams_,
                       _$q_) {
        $scope = $rootScope.$new();
        $q = _$q_;
        NgTableParams = _NgTableParams_;

        areaFactorySpied = {
          getList: sinon.stub()
        };

        $translateSpied = {
          instant: function (key) {
            return '';
          }
        };

        createController = function () {
          return $controller('AreaListController', {
            $translate: $translateSpied,
            NgTableParams: NgTableParams,
            areaFactory: areaFactorySpied
          });
        };
      });
    });

    it('should be a valid controller', function () {
      // Create controller
      vm = createController();
      expect(vm).to.be.an('object');

      expect(vm.rows).to.equal(null);
      expect(vm.noSelectedRows).to.equal(0);
      expect(vm.minItems).to.equal(5);
      expect(vm.maxItems).to.equal(15);
      expect(vm.totalRecords).to.equal(0);
      expect(vm.isCheckAllItems).to.equal(false);

      expect(vm.columns.length).to.equal(4);
    });

    describe('vm.init()', function () {
      beforeEach(function () {
        // Create controller
        vm = createController();
      });

      it('should load table when page loaded', function () {
        // Fake success return
        areaFactorySpied.getList.returns($q.resolve(itemsResponse));
        var loadTable = sinon.spy(vm, 'loadTable');

        // Trigger function
        $scope.$apply(vm.init());

        // After send request expectations
        expect(vm.rows).to.equal(itemsResponse.data.data);
        expect(vm.totalRecords).to.equal(vm.rows.length);
        sinon.assert.calledOnce(loadTable);
      });
    });


    describe('vm.changeCheckAllItems()', function () {
      beforeEach(function () {
        // Create controller
        vm = createController();
        vm.rows = itemsResponse.data.data;
        vm.totalRecords = vm.rows.length;
      });

      it('should call update all selector when click check all', function () {
        // Fake success return
        vm.isCheckAllItems = false;
        var beforeIsCheckAllItems = vm.isCheckAllItems;
        var updateAllSelector = sinon.spy(vm, 'updateAllSelector');

        // Trigger function
        $scope.$apply(vm.changeCheckAllItems());

        // After send request expectations
        expect(vm.isCheckAllItems).to.equal(!beforeIsCheckAllItems);
        expect(vm.noSelectedRows).to.equal(vm.totalRecords);
        sinon.assert.calledOnce(updateAllSelector);
      });

      it('should uncheck all selector when click uncheck all', function () {
        // Fake success return
        vm.isCheckAllItems = true;

        // Trigger function
        $scope.$apply(vm.changeCheckAllItems());

        // After send request expectations
        expect(vm.noSelectedRows).to.equal(0);
        _.each(vm.rows, function (item, key) {
          expect(item.selector).to.equal(false);
        });
      });

    });


    describe('vm.changeSelector()', function () {
      beforeEach(function () {
        // Create controller
        vm = createController();
        vm.rows = itemsResponse.data.data;
      });


      it('should call update all selector when click check row', function () {
        // Fake success return
        var row = vm.rows[1];
        row.selector = true;
        var beforeSelector = row.selector;
        var updateAllSelector = sinon.spy(vm, 'updateAllSelector');

        // Trigger function
        $scope.$apply(vm.changeSelector(row));

        // After send request expectations
        expect(row.selector).to.equal(!beforeSelector);
        sinon.assert.calledOnce(updateAllSelector);
      });

      it('should isCheckAllItems is false when click uncheck row', function () {
        // Fake success return
        var row = vm.rows[1];
        row.selector = false;
        var beforeSelector = row.selector;
        var updateAllSelector = sinon.spy(vm, 'updateAllSelector');

        // Trigger function
        $scope.$apply(vm.changeSelector(row));

        // After send request expectations
        expect(row.selector).to.equal(!beforeSelector);
        expect(vm.isCheckAllItems).to.equal(false);
        sinon.assert.calledOnce(updateAllSelector);
      });
    });


    describe('vm.updateAllSelector()', function () {
      beforeEach(function () {
        // Create controller
        vm = createController();
        vm.rows = itemsResponse.data.data;
        vm.totalRecords = vm.rows.length;
      });


      it('should check selector for all items when click check all', function () {
        // Fake success return
        vm.isCheckAllItems = true;

        // Trigger function
        $scope.$apply(vm.updateAllSelector());

        // After send request expectations
        expect(vm.noSelectedRows).to.equal(vm.totalRecords);

        _.each(vm.rows, function (item, key) {
          expect(item.selector).to.equal(vm.isCheckAllItems);
        });
      });

      it('should check isCheckAllItems when all item selected', function () {
        // Fake success return
        vm.isCheckAllItems = false;
        _.each(vm.rows, function (item, key) {
          item.selector = true;
        });

        // Trigger function
        $scope.$apply(vm.updateAllSelector());

        // After send request expectations
        expect(vm.totalRecords).to.equal(vm.noSelectedRows);
        expect(vm.isCheckAllItems).to.equal(true);
      });
    });


    describe('vm.loadTable()', function () {
      beforeEach(function () {
        // Create controller
        vm = createController();
        vm.rows = itemsResponse.data.data;
        vm.totalRecords = vm.rows.length;
      });


      it('should set NgTableParams when success', function () {
        // Fake data
        var sampleTableParams = new NgTableParams(
          {
            page: 1,
            count: 10,
            sorting: {}
          }, {
            data: vm.rows
          });

        // Trigger function
        $scope.$apply(vm.loadTable());

        // After send request expectations
        expect(vm.tableParams.data.length).to.equal(sampleTableParams.data.length);
        expect(vm.tableParams.page()).to.equal(sampleTableParams.page());
        expect(vm.tableParams.count()).to.equal(sampleTableParams.count());
      });
    });
    // END: loadTable

  });
});
