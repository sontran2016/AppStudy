({
  // If you got a main config file, this is the palce for it
  mainConfigFile: '../src/javascripts/main.js',
  // Relative to this file's location
  baseUrl: './../src/javascripts/',
  // The module name, this uses only a single file,
  // there can be multiple different outputs also
  name: 'main',
  // The destination directory
  out: '../dist/javascripts/main.js',
  // If set to true, any files that were combined into a
  // build bundle will be removed from the output folder.
  removeCombined: true,
  // Finds require() dependencies inside a require() or define call. By default
  // this value is false, because those resources should be considered dynamic/runtime
  // calls. However, for some optimization scenarios, it is desirable to
  // include them in the build.
  findNestedDependencies: true,
  // For test purposes, the output is not minified.
  // In the real world this would be set to uglify, uglify2, or to closure
  optimize: 'none'
})
