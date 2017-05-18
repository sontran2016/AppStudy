define(function (require) {
  'use strict';

  // Load directive module
  var app = require('app/common/services/area'),
    angular = require('angular'),
    areaFactory,
    appConstantSpied,
    $httpBackend;


  describe('Area Factory', function () {

    // Inject home info module
    beforeEach(module('common.services.area'));

    // Spy dependencies
    beforeEach(function() {
      appConstantSpied = angular.fromJson(require('text!./../../../data/appConstant.json'));
      module(function($provide) {
        $provide.value('appConstant', appConstantSpied);
      });
    });

    beforeEach(inject(function (_areaFactory_, _$httpBackend_) {
      areaFactory = _areaFactory_;
      $httpBackend = _$httpBackend_;
    }));

    describe('Order Details Factory Method', function () {
      it('should export area list when getList success', function () {
        // Fake api request
        var orderID = 30;
        $httpBackend.expectGET(appConstantSpied.domain + '/area')
          .respond(200);

        // Trigger function
        areaFactory.getList();
        $httpBackend.flush();
      });
    });
  });
});
