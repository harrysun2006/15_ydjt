module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve all patterns (eg. files, exclude)
    basePath : '',

    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter frameworks: ['jasmine']
    frameworks : [ 'mocha' ],

    // list of files / patterns to load in the browser, files: [ ]
    files : [
      'rest.js',
    ],

    // list of files to exclude, exclude: [ ]
    exclude : [ 'karma.conf.js' ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'coverage'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    // reporters: ['progress']
    reporters : [ 'progress', 'junit', 'coverage' ],

    // preprocess matching files before serving them to the browser // available
    // preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    // preprocessors: { },
    preprocessors : {
      'rest.js' : 'coverage'
    },

    // Code Coverage options. report type available:
    // - html (default)
    // - lcov (lcov and html)
    // - lcovonly
    // - text (standard output)
    // - text-summary (standard output)
    // - cobertura (xml format supported by Jenkins)
    coverageReporter : {
      type : 'html',
      dir : 'coverage/'
    },

    // web server port, port: 9876
    port : 9876,

    // cli runner port
    runnerPort : 9100,

    // enable / disable colors in the output (reporters and logs) colors: true
    colors : true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    // logLevel: config.LOG_INFO,
    logLevel : config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes 
    // autoWatch: true
    autoWatch : true,

    // start these browsers // available browser launchers
    // https://npmjs.org/browse/keyword/karma-launcher browsers: ['Chrome']
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    // CLI --browsers Chrome, Firefox, Safari
    browsers : [ 'PhantomJS' ],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout : 60000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun : false,

    plugins : [
      'karma-mocha',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-junit-reporter',
      'karma-coverage'
    ]
  });
};
