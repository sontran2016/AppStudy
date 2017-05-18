var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var shell = require('gulp-shell');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var karma = require('gulp-karma');
var replace = require('gulp-replace');
var jscs = require('gulp-jscs');
var stylish = require('gulp-jscs-stylish');
var sync = require('run-sequence');
var gulpOpen = require('gulp-open');
var config = require('./config');
var jsdoc = require('jscs-jsdoc');
var argv = require('yargs').argv;
var os = require('os');
var path = require('path');
var ftp = require('vinyl-ftp');
var destFolderName = 'dist';
var gutil = require('gulp-util');
var cssimport = require("gulp-cssimport");
var open = argv.open;
var isProd = argv.prod;
var tinylr, currentVersion, nextVersion;

var paths = {
  scss: ['./src/scss/**/*.scss', './src/scss/**/*.css', './src/js/**/*.css'],
  vendors: [
    './src/javascripts/vendor.angular.js',
    './src/javascripts/vendor.custom.js',
    './src/javascripts/vendor.jquery.js',
    './src/javascripts/vendor.kendo.js'
  ]
};

var ftpConfig = {
  host: isProd ? config.ftp_host_prod : config.ftp_host,
  user: isProd ? config.ftp_user_prod : config.ftp_user,
  password: isProd ? config.ftp_password_prod : config.ftp_password,
  parallel: 10,
  log: gutil.log
};

var domain = isProd ? config.domain_prod : config.domain;

function notifyLiveReload(event) {
  var fileName = path.relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

// Combine scss
gulp.task('scss', function (done) {
  gulp.src('./src/scss/app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    //.pipe(gulp.dest('./src/css/'))
    .pipe(cssimport({}))
    //.pipe(replace(/\(((font|fonts)\/.*?)+\.(eot|woff(2)?|svg|ttf)/gi, '(../css/$1.$3')) // Change KendoUI font path
    //.pipe(replace(/(\.\.)?(((\/bower_components\/)|(\/css\/font(s)?\/)).*?)+\.(eot|woff(2)?|svg|ttf)/gi, domain + '$2.$7')) // Use absolute path for fonts
    .pipe(minifyCss({processImport: false}))
    //.pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('./src/css/'))
    .on('end', done);
});

gulp.task('watch', function () {
  gulp.watch(paths.scss, ['scss']);
  gulp.watch('./src/javascripts/**/*.html', notifyLiveReload);
  gulp.watch('./src/css/*.css', notifyLiveReload);
});

// Copy Fonts

gulp.task('fonts:bower', function () {
  return gulp.src([
      './src/bower_components/**/*.{otf,eot,svg,ttf,woff,woff2}'])
    .pipe(gulp.dest('./' + destFolderName + '/bower_components'));
});

gulp.task('fonts', ['fonts:bower'], function () {
  return gulp.src([
      './src/fonts/**/*'])
    .pipe(gulp.dest('./' + destFolderName + '/fonts/'));
});

gulp.task('images:bower', function () {
  return gulp.src([
      './src/bower_components/**/*.{jpg,jpeg,png,gif,svg}'])
    .pipe(gulp.dest('./' + destFolderName + '/bower_components'));
});

gulp.task('images:css', function () {
  return gulp.src([
      './src/css/**/*.{jpg,jpeg,png,gif,svg}'])
    .pipe(gulp.dest('./' + destFolderName + '/css'));
});

// Copy Images
gulp.task('images', ['images:bower', 'images:css'], function () {
  return gulp.src([
      './src/img/**/*'])
    .pipe(gulp.dest('./' + destFolderName + '/img/'));
});

/*
 * CSS
 * */
gulp.task('css:js', function (done) {
  return gulp.src([
      './src/js/wcDocker/Themes/ims.css'
    ])
    .pipe(gulp.dest('./' + destFolderName + '/js/'));
});

gulp.task('css:bower', function (done) {
  done();
  // return gulp.src([
  //     './src/bower_components/**/*.css'])
  //   .pipe(gulp.dest('./' + destFolderName + '/bower_components/'));
});

gulp.task('css', ['css:js', 'css:bower'], function () {
  return gulp.src('./src/css/app.css')
    .pipe(gulp.dest('./' + destFolderName + '/css'));
});


/*
 * Scripts
 * */

gulp.task('script:requirejs', function () {
  return gulp.src([
      './src/bower_components/requirejs/*',
      './src/bower_components/requirejs/**/*.*'])
    .pipe(gulp.dest('./' + destFolderName + '/bower_components/requirejs'));
});

gulp.task('templates:js', function () {
  return gulp.src([
      './src/js/**/*.html'])
    .pipe(gulp.dest('./' + destFolderName + '/js'));
});

gulp.task('templates:images', function () {
  return gulp.src([
      './src/js/**/*.{jpg,jpeg,png,gif,svg}'])
    .pipe(gulp.dest('./' + destFolderName + '/js'));
});

gulp.task('templates', ['templates:js', 'templates:images'], function () {
  return gulp.src([
      './src/javascripts/app/common/templates/**/*'])
    .pipe(gulp.dest('./' + destFolderName + '/javascripts/app/common/templates'));
});

gulp.task('script', ['templates', 'script:requirejs'], function (done) {
  done();
  //return gulp.src([
  //  './src/js/**/*'])
  //  .pipe(gulp.dest('./' + destFolderName + '/js'));
});

// Language files
gulp.task('languageFiles', function () {
  return gulp.src([
      './src/javascripts/app/**/*.json'
    ])
    .pipe(gulp.dest('./' + destFolderName + '/javascripts/app'));
});

// Favicon
gulp.task('favicon', function () {
  return gulp.src([
      './src/favicon.ico'])
    .pipe(gulp.dest('./' + destFolderName + '/'));
});

// Copy index.html, rename main and css file
gulp.task('html', ['favicon', 'languageFiles'], function () {
  return gulp.src([
      './src/index.html'])
    .pipe(gulp.dest('./' + destFolderName + '/'));
});


/**
 * SERVER
 * */

gulp.task('package', function () {
  return gulp.src([
      './package.build.json'])
    .pipe(rename('package.json'))
    .pipe(gulp.dest('./' + destFolderName + '/'));
});

gulp.task('config', function () {
  return gulp.src([
      './config.js'])
    .pipe(gulp.dest('./' + destFolderName + '/'));
});

gulp.task('server:code', function () {
  return gulp.src([
      './server/**/*'])
    .pipe(gulp.dest('./' + destFolderName + '/server/'));
});

gulp.task('server', ['server:code', 'package', 'config'], function () {
  return gulp.src([
      './server.js'])
    .pipe(gulp.dest('./' + destFolderName + '/'));
});

/*
 * Replace fields
 * */
gulp.task('replaceData', function () {
  return gulp.src([
      './' + destFolderName + '/javascripts/main.js'
    ])
    .pipe(replace(/domain:(\s)?'.*'/gi, 'domain: \'' + domain + '\'')) // Replace base domain based environment
    .pipe(uglify())
    .pipe(gulp.dest('./' + destFolderName + '/javascripts/'));
});

// RequireJS Optimization
// Window r.js command line fix (It conflict between r.js and r.cmd.js)
// del %HOMEDRIVE%%HOMEPATH%\AppData\Roaming\npm\r.js
// del node_modules\.bin\r.js
gulp.task('optimizer', shell.task([
  'r.js -o build-scripts/jquery.js',
  'r.js -o build-scripts/kendo.js',
  'r.js -o build-scripts/angular.js',
  'r.js -o build-scripts/custom.js',
  'r.js -o build-scripts/app.js'
]));

gulp.task('build', function (done) {
  sync('scss', 'fonts', 'images', 'css', 'script', 'html', 'server', 'optimizer', 'replaceData', done);
});

// Jshint
gulp.task('lint', function () {
  return gulp.src([
      './src/javascripts/app/common/**/*.js',
      './src/javascripts/app/modules/**/*.js'
    ])
    // .pipe(jshint('.jshintrc'))
    // .pipe(jshint.reporter('jshint-stylish')) // use any jshint reporter to log hint
    // .pipe(jshint.reporter('fail')) // use any jshint reporter to log hint
    // .pipe(jscs({configPath: ".jscsrc"}))
    // .pipe(jscs.reporter());


    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .pipe(jscs({configPath: ".jscsrc"}))
    .pipe(jscs.reporter());
});

// Test task
gulp.task('test', ['lint'], function () {
  // Be sure to return the stream
  return gulp.src([
      'undefined.js' // https://github.com/lazd/gulp-karma/issues/7
    ])
    .pipe(karma({
      configFile: './karma.conf.js',
      action: 'run'
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});

// Development task
gulp.task('express', function () {
  var express = require('express');
  var app = express();
  var port = process.env.PORT || (argv.port || config.DEV_PORT);
  var dir = argv.dir || 'src';
  var assetPath = path.join(__dirname, dir);
  app.use(require('connect-livereload')({port: config.LIVERELOAD_PORT}));
  app.use(express.static(assetPath));
  app.listen(port, function () {
    console.log('Express server listening on port ' + port);
  });
  app.get('/', function (req, res) {
    res.sendFile("index.html");
  });
});

gulp.task('livereload', function () {
  tinylr = require('tiny-lr')();
  tinylr.listen(config.LIVERELOAD_PORT);
});

gulp.task('default', ['scss', 'express', 'livereload', 'watch'], function () {
  var browser = os.platform() === 'linux' ? 'google-chrome' : (
    os.platform() === 'darwin' ? 'google chrome' : (
      os.platform() === 'win32' ? 'chrome' : 'firefox'));
  return gulp.src('./src/index.html').pipe(gulpOpen({
    uri: 'http://localhost:' + config.DEV_PORT,
    app: browser
  }));
});

////////////////////////////////////
///////// DEPLOY TASKS /////////////
///////////////////////////////////
gulp.task('deploy:UI', function () {
  process.stdout.write('Transfering UI files...\n');

  var conn = ftp.create(ftpConfig);
  var dest = isProd ? '/site/wwwroot' : '/';
  var globs = [
    destFolderName + '/**/*',
    '!' + destFolderName + '/index.html',
    '!' + destFolderName + '/package.json',
    '!' + destFolderName + '/server.js'
  ];

  return gulp.src(globs, {base: './' + destFolderName, buffer: false})
    .pipe(conn.newer(dest))
    .pipe(conn.dest(dest));
});

gulp.task('deploy:index:data', function () {
  var cdnBaseUrl = "",
    version = "?_v=" + nextVersion;

  if (isProd) {
    cdnBaseUrl = config.cdnBaseUrl + '/';
  }

  return gulp.src([
      destFolderName + '/index.html'
    ])
    .pipe(replace(/<base href=".*?"(\s)?\/>/, '<base href="/" />'))
    .pipe(replace('"css/app.css"', '"' + cdnBaseUrl + 'css/app.css' + version + '"'))
    .pipe(replace('"bower_components/requirejs/require.js"', '"' + cdnBaseUrl + 'bower_components/requirejs/require.js"'))
    .pipe(replace('"javascripts/main"', '"' + cdnBaseUrl + 'javascripts/main"'))
    .pipe(replace("// requirejs configuration", "requirejs.s.contexts._.realNameToUrl = requirejs.s.contexts._.nameToUrl;\
                                          requirejs.s.contexts._.nameToUrl = function () {\
                                            var url = requirejs.s.contexts._.realNameToUrl.apply(this, arguments);\
                                            if (!/^http/.test(url) || " + new RegExp('^' + config.cdnBaseUrl) + ".test(url)) {\
                                              if (url.indexOf('?') > -1) {\
                                                url += '&';\
                                              } else {\
                                                url += '?';\
                                              }\
                                              url += '_v=" + nextVersion + "';\
                                            }\
                                            return url;\
                                          };"
    ))
    .pipe(gulp.dest('./' + destFolderName + '/'));
});

gulp.task('deploy:index', ['deploy:index:data'], function () {
  process.stdout.write('Transfering index.html file...\n');

  var conn = ftp.create(ftpConfig);
  var dest = isProd ? '/site/wwwroot' : '.';
  var globs = [
    destFolderName + '/index.html'
  ];

  return gulp.src(globs, {base: './' + destFolderName, buffer: false})
    .pipe(conn.newer(dest))
    .pipe(conn.dest(dest));
});

gulp.task('deploy', function (done) {
  sync('bump', 'build', 'deploy:UI', 'deploy:index', function () {
    if (open) {
      var browser = os.platform() === 'linux' ? 'google-chrome' : (
        os.platform() === 'darwin' ? 'google chrome' : (
          os.platform() === 'win32' ? 'chrome' : 'firefox'));
      gulp.src('./src/index.html').pipe(gulpOpen({
        uri: domain,
        app: browser
      }));
    }
    done();
  });
});

////////////////////////////////////
///////// VERSION TASKS ////////////
///////////////////////////////////

gulp.task('bump:version', function () {
  var packageJson = JSON.parse(require('fs').readFileSync('./package.json'));
  currentVersion = packageJson.version;
  // nextVersion = require('semver').inc(currentVersion, 'patch');
  nextVersion = currentVersion;
});

gulp.task('bump:package', function () {
  return gulp.src(['./package.json'])
    .pipe(require('gulp-bump')({version: nextVersion}))
    .pipe(gulp.dest('./'));
});

gulp.task('bump:bower', function () {
  return gulp.src(['./bower.json'])
    .pipe(require('gulp-bump')({version: nextVersion}))
    .pipe(gulp.dest('./'));
});

gulp.task('bump:config', function () {
  return gulp.src(['./config.js'])
    .pipe(replace(/version:(\s)?'.*'/gi, 'version: \'' + nextVersion + '\''))
    .pipe(gulp.dest('./'));
});

gulp.task('bump:app:config', function () {
  return gulp.src(['./src/javascripts/app/config.js'])
    .pipe(replace(/version:(\s)?'.*'/gi, 'version: \'' + nextVersion + '\''))
    .pipe(gulp.dest('./src/javascripts/app/'));
});

gulp.task('bump:vendor', function () {
  return gulp.src([
      './src/javascripts/main.js'
    ])
    .pipe(replace(/'_v=.*'/gi, '\'_v=' + nextVersion + '\''))
    .pipe(gulp.dest('./src/javascripts/'));
});

gulp.task('bump', function (done) {
  if (!argv.disableVersion) {
    sync('bump:version', 'bump:package', 'bump:bower', 'bump:config', 'bump:vendor', 'bump:app:config', done);
  }
  else {
    done();
  }
});
