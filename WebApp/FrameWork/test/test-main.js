var tests = [];

for(var file in window.__karma__.files) {
  if(window.__karma__.files.hasOwnProperty(file)) {
    if(/Spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

requirejs.config({
  // Karma serves files from '/base'
  baseUrl: '/base',
  // runtime paths and shims
  paths: {
    // end of network components
    jQuery: 'src/bower_components/jquery/dist/jquery',
    jQueryMouseWheel: 'src/bower_components/jquery-mousewheel/jquery.mousewheel',
    malihuScrollBar: 'src/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar',
    angular: 'src/bower_components/angular/angular',
    angularAnimate: 'src/bower_components/angular-animate/angular-animate',
    angularLocalStorage: 'src/bower_components/angularLocalStorage/src/angularLocalStorage',
    angularLoadingBar: 'src/bower_components/angular-loading-bar/src/loading-bar',
    angularSanitize: 'src/bower_components/angular-sanitize/angular-sanitize',
    angularCookies: 'src/bower_components/angular-cookies/angular-cookies',
    angularBootstrap: "src/bower_components/angular-bootstrap/ui-bootstrap-tpls",
    uiRouter: 'src/bower_components/angular-ui-router/release/angular-ui-router',
    moment: 'src/bower_components/moment/moment',
    toaster: "src/bower_components/AngularJS-Toaster/toaster",
    ngFileUpload: "src/bower_components/ng-file-upload/ng-file-upload-all",
    autosize: "src/bower_components/autosize/dist/autosize",
    ngTable: 'src/bower_components/ng-table/dist/ng-table',
    angularBreadcrumb: 'src/bower_components/angular-breadcrumb/dist/angular-breadcrumb',
    angularTranslate: 'src/bower_components/angular-translate/angular-translate',
    angularTranslateLoaderPartial: 'src/bower_components/angular-translate-loader-partial/angular-translate-loader-partial',

    // The app code itself
    app: 'src/javascripts/app',

    // Requirejs plugin
    text: 'src/bower_components/text/text',
    lodash: 'src/bower_components/lodash/lodash',

    // Test dependencies
    chai: 'node_modules/chai/chai',
    "chai-as-promised": 'node_modules/chai-as-promised/lib/chai-as-promised',
    sinon: 'node_modules/sinon/lib/sinon',
    "sinon-chai": 'node_modules/sinon-chai/lib/sinon-chai'
  },

  shim: {
    "jQuery": {
      exports: "jQuery"
    },
    "jQueryMouseWheel": {
      deps: ["jQuery"]
    },
    "malihuScrollBar": {
      deps: ["jQuery", "jQueryMouseWheel"]
    },
    "angular": {
      deps: ["jQuery"],
      exports: "angular"
    },
    "angularMocks": {
      deps: ["angular"]
    },
    "uiRouter": {
      deps: ["angular"]
    },
    "angularLocalStorage": {
      deps: ["angular", "angularCookies"]
    },
    "angularCookies": {
      deps: ["angular"]
    },
    "angularLoadingBar": {
      deps: ["angular"]
    },
    "angularAnimate": {
      deps: ['angular']
    },
    "angularSanitize": {
      deps: ['angular']
    },
    "toaster": {
      deps: ['angular', 'angularAnimate']
    },
    "angularBootstrap": {
      deps: ['angular']
    },
    "ngFileUpload": {
      deps: ['angular']
    },
    "ngTable": {
      deps: ['angular']
    },
    "angularBreadcrumb": {
      deps: ['angular']
    },
    'angularTranslate': {
      deps: ['angular']
    },
    'angularTranslateLoaderPartial': {
      deps: ['angularTranslate']
    }
  },

  // ask Require.js to load these files (all our tests)
  deps: tests

  // start test run, once Require.js is done
  //callback: window.__karma__.start
});

require([
  'chai',
  'chai-as-promised',
  'sinon-chai'
], function(chai, chaiaspromised, sinonChai) {
  'use strict';

  window.chai = chai;
  chai.use(chaiaspromised);
  chai.use(sinonChai);

  // window.assert = chai.assert;
  window.expect = chai.expect;
  // should = chai.should();

  require(tests, function() {
    window.__karma__.start();
  });
});
