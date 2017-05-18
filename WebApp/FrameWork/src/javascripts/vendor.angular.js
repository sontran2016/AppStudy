'use strict';
require.config({
  //baseUrl'./../..',
  preserveLicenseComments: false,
  generateSourceMaps: false,
  // runtime paths and shims
  paths: {
    // Reference, below libraries wont be combined
    jquery: '../bower_components/jquery/dist/jquery',
    jQueryUI: '../bower_components/jquery-ui/jquery-ui',

    // Include
    moment: '../bower_components/moment/moment',
    autosize: '../bower_components/autosize/dist/autosize',
    lodash: '../bower_components/lodash/lodash',

    angular: '../bower_components/angular/angular',
    angularAnimate: '../bower_components/angular-animate/angular-animate',
    angularMocks: '../bower_components/angular-mocks/angular-mocks',
    angularLocalStorage: '../bower_components/angularLocalStorage/src/angularLocalStorage',
    angularLoadingBar: '../bower_components/angular-loading-bar/src/loading-bar',
    angularSanitize: '../bower_components/angular-sanitize/angular-sanitize',
    angularCookies: '../bower_components/angular-cookies/angular-cookies',
    angularBootstrap: '../bower_components/angular-bootstrap/ui-bootstrap-tpls',
    angularMoment: '../js/angular-moment/angular-moment',
    uiRouter: '../bower_components/angular-ui-router/release/angular-ui-router',
    toaster: '../bower_components/AngularJS-Toaster/toaster',
    ngFileUpload: '../bower_components/ng-file-upload/ng-file-upload-all',
    ngTable: '../bower_components/ng-table/dist/ng-table',
    angularBreadcrumb: '../bower_components/angular-breadcrumb/dist/angular-breadcrumb',
    angularMessages: '../bower_components/angular-messages/angular-messages',
    angularTranslate: '../bower_components/angular-translate/angular-translate',
    angularTranslateLoaderPartial: '../bower_components/angular-translate-loader-partial/angular-translate-loader-partial',
    ngTagsInput: '../bower_components/ng-tags-input/ng-tags-input',
    angularSortable: '../bower_components/angular-ui-sortable/sortable',
    angularSignalR: '../bower_components/angular-signalr-hub/signalr-hub',
    angularTree: '../bower_components/angular-ui-tree/dist/angular-ui-tree',
    malharDashboard: '../js/malhar-dashboard/malhar-dashboard',

    text: '../bower_components/text/text',
    async: '../bower_components/requirejs-plugins/src/async'
  },

  shim: {
    'angular': {
      deps: ['jquery'],
      exports: 'angular'
    },
    'angularMocks': {
      deps: ['angular']
    },
    'uiRouter': {
      deps: ['angular']
    },
    'angularLocalStorage': {
      deps: ['angular', 'angularCookies']
    },
    'angularCookies': {
      deps: ['angular']
    },
    'angularLoadingBar': {
      deps: ['angular']
    },
    'angularAnimate': {
      deps: ['angular']
    },
    'angularSanitize': {
      deps: ['angular']
    },
    'toaster': {
      deps: ['angular', 'angularAnimate']
    },
    'angularBootstrap': {
      deps: ['angular']
    },
    'ngFileUpload': {
      deps: ['angular']
    },
    'ngTable': {
      deps: ['angular']
    },
    'angularBreadcrumb': {
      deps: ['angular']
    },
    'angularMessages': {
      deps: ['angular']
    },
    'angularTranslate': {
      deps: ['angular']
    },
    'angularTranslateLoaderPartial': {
      deps: ['angularTranslate']
    },
    'ngTagsInput': {
      deps: ['angular']
    },
    'angularSignalR': {
      deps: ['angular']
    },
    'angularTree': {
      deps: ['angular']
    },
    'angularSortable': {
      deps: ['angular', 'jQueryUI']
    },
    'malharDashboard': {
      deps: ['angular', 'angularBootstrap', 'angularSortable']
    }
  },
  exclude:[
    'jquery'
  ],
  include: [
    'angular',
    'angularAnimate',
    'angularMocks',
    'angularLocalStorage',
    'angularLoadingBar',
    'angularSanitize',
    'angularCookies',
    'angularBootstrap',
    'uiRouter',
    'moment',
    'toaster',
    'ngFileUpload',
    'autosize',
    'ngTagsInput',
    'ngTable',
    'angularBreadcrumb',
    'lodash',
    'text',
    'async',
    'angularMessages',
    'angularTranslate',
    'angularTranslateLoaderPartial',
    'angularMoment',
    'angularSignalR',
    'angularTree',
    'angularSortable',
    'malharDashboard'
  ]
});
