'use strict';
require.config({
  //baseUrl: '../src/',
  preserveLicenseComments: false,
  generateSourceMaps: false,
  // runtime paths and shims
  paths: {
    jquery: '../bower_components/jquery/dist/jquery',
    jQueryMouseWheel: '../bower_components/jquery-mousewheel/jquery.mousewheel',
    malihuScrollBar: '../bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar',
    iCheck: '../bower_components/iCheck/icheck',
    signalR: '../bower_components/signalr/jquery.signalR',
    hub: '../js/signalr-hub/hub'
  },

  shim: {
    'jquery': {
      exports: 'jQuery'
    },
    'jQueryMouseWheel': {
      deps: ['jquery']
    },
    'malihuScrollBar': {
      deps: ['jquery', 'jQueryMouseWheel']
    },
    'iCheck': {
      deps: ['jquery']
    },
    'signalR': {
      deps: ['jquery']
    },
    'hub': {
      deps: ['signalR']
    }
  },

  include: [
    'jquery',
    'jQueryMouseWheel',
    'malihuScrollBar',
    'iCheck',
    'signalR',
    'hub'
  ]
});
