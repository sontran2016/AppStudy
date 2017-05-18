// Karma configuration
// Generated on Thu Jan 29 2015 22:24:29

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'requirejs', 'chai', 'chai-as-promised', 'sinon-chai'],
    //frameworks: ['mocha', 'requirejs', 'chai'],

    files: [
      {pattern: "src/bower_components/autosize/dist/autosize.js", included: false},
      {pattern: "src/bower_components/moment/moment.js", included: false},
      {pattern: "src/bower_components/lodash/lodash.js", included: false},
      {pattern: "src/bower_components/jquery/dist/jquery.js", included: false},
      {pattern: "src/bower_components/jquery-mousewheel/jquery.mousewheel.js", included: false},
      {pattern: "src/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js", included: false},
      {pattern: "src/bower_components/angular/angular.js", included: true},
      {pattern: "src/bower_components/angular-mocks/angular-mocks.js", included: true},
      {pattern: "src/bower_components/angular-animate/angular-animate.js", included: false},
      {pattern: "src/bower_components/angularLocalStorage/src/angularLocalStorage.js", included: false},
      {pattern: "src/bower_components/angular-loading-bar/src/loading-bar.js", included: false},
      {pattern: "src/bower_components/angular-sanitize/angular-sanitize.js", included: false},
      {pattern: "src/bower_components/angular-cookies/angular-cookies.js", included: false},
      {pattern: "src/bower_components/angular-bootstrap/ui-bootstrap-tpls.js", included: false},
      {pattern: "src/bower_components/ng-file-upload/ng-file-upload-all.js", included: false},
      {pattern: "src/bower_components/angular-ui-router/release/angular-ui-router.js", included: false},
      {pattern: "src/bower_components/AngularJS-Toaster/toaster.js", included: false},
      {pattern: "src/bower_components/ng-table/dist/ng-table.js", included: false},
      {pattern: "src/bower_components/angular-breadcrumb/dist/angular-breadcrumb.js", included: false},
      {pattern: "src/bower_components/angular-messages/angular-messages.js", included: false},
      {pattern: "src/bower_components/angular-translate/angular-translate.js", included: false},
      {pattern: "src/bower_components/angular-translate-loader-partial/angular-translate-loader-partial.js", included: false},

      // Kendo
      {pattern: "src/js/kendo-ui/**/*", included: false},

      {pattern: 'node_modules/chai/**/*', included: false, watch: false},
      {pattern: 'node_modules/chai-as-promised/**/*', included: false, watch: false},
      {pattern: 'node_modules/sinon/**/*', included: false, watch: false},
      {pattern: 'node_modules/sinon-chai/lib/sinon-chai.js', included: false, watch: false},
      {pattern: 'src/bower_components/text/text.js', included: false},
      //
      {pattern: 'src/javascripts/app/**/*.js', watched: true, included: false, served: true},
      {pattern: 'src/javascripts/app/**/*.html', watched: true, included: false, served: true},
      //{pattern: 'src/javascripts/app/common/directives/*.js', watched: true, included: false, served: true},
      //{pattern: 'src/javascripts/app/common/directives/**/*.js', watched: true, included: false, served: true},
      //{pattern: 'src/javascripts/app/common/services/*.js', watched: true, included: false, served: true},
      //{pattern: 'src/javascripts/app/common/templates/*.html', watched: true, included: false, served: true},
      ////{pattern: 'src/javascripts/app/common/resources/*.js', watched: false, included: false, served: true},
      //{pattern: 'src/javascripts/app/common/context/*.js', watched: false, included: false, served: true},
      //{pattern: 'src/javascripts/app/modules/**/*.js', watched: true, included: false, served: true},
      //{pattern: 'src/javascripts/app/modules/**/**/*.js', watched: false, included: false, served: true},
      //{pattern: 'src/javascripts/app/modules/**/**/*.html', watched: false, included: false, served: true},
      //
      {pattern: 'test/unit/**/*Spec.js', included: false},
      //{pattern: 'test/ittest/**/*Spec.js', included: false},
      {pattern: 'test/**/*.json', included: false},
      {pattern: 'src/**/*.json', included: false},
      'test/test-main.js'
    ],

    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    //logLevel: config.LOG_INFO,
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['PhantomJS', 'Firefox', 'Chrome'],
    browsers: ['PhantomJS'],
    //browsers: ['Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
