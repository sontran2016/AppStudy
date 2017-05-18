'use strict';
require.config({
  preserveLicenseComments: false,
  generateSourceMaps: false,
  // runtime paths and shims
  paths: {
    // Reference, below libraries wont be combined
    jquery: '../bower_components/jquery/dist/jquery',
    lodash: '../bower_components/lodash/lodash',

    // Include

  },

  shim: {

  },
  include: [

  ],
  exclude: [
    'jquery',
    'lodash'
  ]
});
