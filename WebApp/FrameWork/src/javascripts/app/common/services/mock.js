/* istanbul ignore next */
// We will be using backend-less development
// $http uses $httpBackend to make its calls to the server
// $resource uses $http, so it uses $httpBackend too
// We will mock $httpBackend, capturing routes and returning data
define(function (require) {

  'use strict';
  var angular = require('angular'),
    angularMocks = require('angularMocks'),
    areaListResp = require('text!app/common/resources/area/list.json'),
    troubleshootDetailsResp = require('text!app/common/resources/troubleshoot/troubleshoot.json'),
    troubleshootsResp = require('text!app/common/resources/troubleshoot/troubleshoots.json'),
    listMachine = angular.fromJson(require('text!./../resources/machine/list.json')),
    module;

  module = angular.module('common.services.mock', [
    'ngMockE2E'
  ]);

  module.run([
    '$httpBackend',
    'appConstant',
    function ($httpBackend,
              appConstant) {

      $httpBackend.whenGET(appConstant.domain + '/area?_v=' + appConstant.version)
        .respond(function (url, headers, keys) {
          return [200, areaListResp];
        });

      $httpBackend.whenGET(appConstant.domain + '/api/troubleshoots/troubleshoot/troubleshootIdABC?_v=' + appConstant.version)
        .respond(function (url, headers, keys) {
          return [200, troubleshootDetailsResp];
        });

      $httpBackend.whenGET(appConstant.domain + '/api/troubleshoots/bypage?_v=' + appConstant.version + '&areaIds=029bc5ce-978d-4d7c-8dfa-caebc2bbeb09,f8413ce1-866b-48ed-8da7-dd00d3bf2fd1,9afdb5f1-be8b-4b9e-9f09-581cc16834e7,6c2a7979-a2af-4a71-b2c3-1e43b5fb4795,4b48033f-1da8-42ac-a428-45be1d361659,ed2151c9-c24c-4e49-b0f1-955c11af850f,829fee3e-a7a0-4025-afab-36b65eb088ff,0168d3df-f2de-4e5a-81ac-78a96aa6b9aa,f25ebf9f-589f-47c4-961b-d3d7d0a3cc6c,d638fd71-16e1-4096-a003-a2db7a6fffea,f89905c0-a5d1-49fc-8783-03064da6ad95,50026a40-bd74-46b7-8e38-c84dd39aa04d,b37cd823-f515-4510-8a18-67252479e81d,a00a1148-99f1-4dec-b4ce-b15509695fed,8bb6fed3-00c1-46e7-a7ce-617e7a5b2df4,e939aff1-a325-4a4c-b9fc-f07f3201a4ce,1b2dcc36-3d8f-44bb-b7ef-c756c79aa55d,be7fdbe5-5e1a-44da-ae5b-0d0296395cc3,cdbd6666-cac1-40e8-a44b-4eb00585c3ac,f317d79e-4011-42d0-8786-36596faeb069,1724c50d-3b6d-41e2-bc04-ea28e46aec70,2faa81f5-9711-4256-a95e-98d434daf457,2fb4df38-8af1-4a03-a447-28130984fb23,18ae3afe-4b48-49d8-811d-f197cdb0e5c2,07e07da7-1584-4b57-8dc0-fdf81086b9ab,9414414d-d36a-452f-a344-e4a5e3159b95,e2281335-4c21-4fc1-b92a-16953aa644cd,dc4c9142-7ef3-4fa5-8686-b6d828ffa29c,230fe668-72d4-40a1-86bf-2a95c49ad4ca&keySort=id&keyword=&orderDescending=false&pageIndex=0&pageSize=10')
        .respond(function (url, headers, keys) {
          return [200, troubleshootsResp];
        });


      $httpBackend.whenGET(appConstant.domain + '/api/machines/bypage?_v=' + appConstant.version + '&keySort=id&keyword=&orderDescending=false&pageIndex=0&pageSize=10')
        .respond(function (url, headers, keys) {
          return [200, listMachine];
        });


      $httpBackend.whenGET(/.*/).passThrough();
      $httpBackend.whenPOST(/.*/).passThrough();
      $httpBackend.whenDELETE(/.*/).passThrough();
      $httpBackend.whenPUT(/.*/).passThrough();
      $httpBackend.whenPATCH(/.*/).passThrough();
    }]);

  return module.name;
});
