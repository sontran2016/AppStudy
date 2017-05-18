define(function (require) {
  'use strict';

  var angular = require('angular'),
    uiRouter = require('uiRouter'),
    angularLocalStorage = require('angularLocalStorage'),
    config = require('./config'),
    angularAnimate = require('angularAnimate'),
    common = require('./common/index'),
    startup = require('./startup'),
    provider = require('./provider'),
    modules = require('./modules/main'),
    angularBootstrap = require('angularBootstrap'),
    angularSanitize = require('angularSanitize'),
    angularLoadingBar = require('angularLoadingBar'),
    toaster = require('toaster'),
    angularBreadcrumb = require('angularBreadcrumb'),
    angularMessages = require('angularMessages'),
    ngFileUpload = require('ngFileUpload'),
    ngTagsInput = require('ngTagsInput'),
    iCheck = require('iCheck'),
    kendoEditor = require('kendo.editor'),
    kendoAngular = require('kendo.angular'),
    kendoSplitter = require('kendo.splitter'),
    kendoDateTimePicker = require('kendo.datetimepicker'),
    kendoMultiselect = require('kendo.multiselect'),
    ngTable = require('ngTable'),
    angularTranslate = require('angularTranslate'),
    angularTranslateLoaderPartial = require('angularTranslateLoaderPartial'),
    angularMoment = require('angularMoment'),
    kendoGrid = require('kendo.grid'),
    kendoDatavizChart = require('kendo.dataviz.chart'),
    signalR = require('signalR'),
    angularSignalR = require('angularSignalR'),
    angularTree = require('angularTree'),
    angularSortable = require('angularSortable'),
    malharDashboard = require('malharDashboard'),
    hub = require('hub');

  var app = angular.module('app', [
    // Plugins
    'angularLocalStorage',
    'ui.router',
    'ngAnimate',
    'ui.bootstrap',
    'angular-loading-bar',
    'ngSanitize',
    'toaster',
    'ncy-angular-breadcrumb',
    'ngMessages',
    'ngFileUpload',
    'kendo.directives',
    'ngTable',
    'pascalprecht.translate',
    'angularMoment',
    'ngTagsInput',
    'SignalR',
    'ui.tree',
    'ui.sortable',
    'ui.dashboard',

    // Configuration
    config,

    // Common
    common,

    provider,

    // Start up
    startup,

    // modules
    modules
  ]);

  app.run(['signalRFactory', 'userContext', 'appConstant', function (signalRFactory, userContext, appConstant) {
    var authentication = userContext.authentication();

    if(authentication.token){
      signalRFactory.setOptions({
        url: appConstant.domain + '/signalr',
        //qs: {'Bearer': authentication.token}
        header: { Authorization: "Bearer " + authentication.token }
      });
      signalRFactory.start();
    }
  }])

  .run(['$rootScope', '$location', '$interval', 'storage', 'appConstant', function($rootScope, $location, $interval, storage, appConstant) {
      var lastDigestRun = Date.now();
      var idleCheck = $interval(function() {
          var now = Date.now();            
          if (now - lastDigestRun > appConstant.timeOut) {
            storage.remove('permissionData');
            storage.remove('authenticationData');
          }
      }, 60*1000);

      $rootScope.$on('$routeChangeStart', function(evt) {
          lastDigestRun = Date.now();  
      });
  }]);


  app.controller('AppController', [
    '$scope',
    'appConstant', function ($scope,
                             appConstant) {
    }]);

  return app;
});
