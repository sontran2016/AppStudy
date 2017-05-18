'use strict';

require.config({
  //baseUrl'./../..',
  preserveLicenseComments: false,
  generateSourceMaps: false,
  // runtime paths and shims
  paths: {
    // Requirejs plugins
    text: '../bower_components/text/text',
    async: '../bower_components/requirejs-plugins/src/async',

    // Angular Libraries
    'angular': 'empty:',
    'angularMocks': 'empty:',
    'angularAnimate': 'empty:',
    'angularLocalStorage': 'empty:',
    'angularLoadingBar': 'empty:',
    'angularSanitize': 'empty:',
    'angularCookies': 'empty:',
    'angularBootstrap': 'empty:',
    'uiRouter': 'empty:',
    'moment': 'empty:',
    'toaster': 'empty:',
    'ngFileUpload': 'empty:',
    'autosize': 'empty:',
    'ngTable': 'empty:',
    'angularBreadcrumb': 'empty:',
    'lodash': 'empty:',
    'angularMessages': 'empty:',
    'angularjs-dropdown-multiselect': 'empty:',
    'angularWizard': 'empty:',
    'angularTranslate': 'empty:',
    'angularTranslateLoaderPartial': 'empty:',
    'ngTagsInput': 'empty:',
    'angularMoment': 'empty:',
    'angularSignalR': 'empty:',
    'angularTree': 'empty:',
    'angularSortable': 'empty:',
    'malharDashboard': 'empty:',

    // jQuery libraries
    'jquery': 'empty:',
    'jQueryMouseWheel': 'empty:',
    'malihuScrollBar': 'empty:',
    'leaflet': 'empty:',
    'leafletDraw': 'empty:',
    'leafletLabel': 'empty:',
    'spectrum': 'empty:',
    'spin': 'empty:',
    'ladda': 'empty:',
    'iCheck': 'empty:',
    'signalR': 'empty:',
    'hub': 'empty:',

    // kendo libraries
    'kendo.editor': 'empty:',
    'kendo.angular': 'empty:',
    'kendo.datetimepicker': 'empty:',
    'kendo.multiselect': 'empty:',
    'kendo.splitter': 'empty:',
    'kendo.numerictextbox': 'empty:',
    'kendo.treeview': 'empty:',
    'kendo.grid': 'empty:',
    'kendo.dataviz.chart': 'empty:',

    // custom libraries
    'leafletContextMenu': 'empty:',
    'leafletCustomDraw': 'empty:',
    'leafletSearchControl': 'empty:',
    'leafletLegendControl': 'empty:',
    'leafletControlLoading': 'empty:',
    'leafletIconPulse': 'empty:',
    'leafletRuler': 'empty:',
    'leafletText': 'empty:',
    'leafletConnection': 'empty:',
    'leafletUti': 'empty:',
    'leaftletPulseText': 'empty:',
    'wcDocker': 'empty:',
    'leaftletGroupMarkers': 'empty:',
    'leafletCluster': 'empty:',
    'leafletSidebar': 'empty:',
    'leafletButton': 'empty:',
    'leafletAlarm': 'empty:'
  },

  shim: {},
  exclude: [
    'text',
    'async',
    './vendor.jquery',
    './vendor.kendo',
    './vendor.angular',
    './vendor.custom'
  ],
  include: []
});

// Load core libraries first
// jquery and plugins
require([
  './vendor.jquery'
], function () {
  // angular and modules
  require([
    './vendor.angular'
  ], function () {
    // kendo and plugins
    require([
      './vendor.kendo'
    ], function () {
      // Custom plugins
      require([
        './vendor.custom'
      ], function () {
        // IE console issue when the developer tools are not opened.
        //Ensures there will be no 'console is undefined' errors
        if (!window.console) {
          window.console = window.console || (function () {
              var c = {};
              c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function () {
              };
              return c;
            })();
        }

        // Finally load the app
        require([
          'angular',
          'app/app'
        ], function (angular, app) {
          var $html = angular.element(document.getElementsByTagName('html')[0]);
          angular.element().ready(function () {
            //$html.addClass('ng-app');
            angular.bootstrap($html, [app.name]);
          });
        });

      });
    });
  });
});
