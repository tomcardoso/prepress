var gulp = require('gulp'),
  gulpConfig = require('./gulp.config.js'),
  rollupConfig = require('./rollup.config.js'),
  rollup = require('rollup').rollup,
  uglify = require('rollup-plugin-uglify'),
  eslint = require('rollup-plugin-eslint'),
  strip = require('rollup-plugin-strip');

var cache;

gulp.task('_rollup-build', function() {
  var rConfig = Object.assign({}, rollupConfig);
  rConfig.plugins.push(
    uglify(),
    eslint(),
    strip({
      debugger: true,
      functions: ['console.log', 'assert.*', 'debug', 'alert'],
      sourceMap: false
    })
  );
  return rollup(rConfig).then(function(bundle) {
    return bundle.write({
      format: 'iife',
      dest: gulpConfig.buildPath + '/scripts/main.min.js',
      moduleName: 'globeInteractiveInit'
    });
  });
});

gulp.task('_rollup', () => {
  var rConfig = Object.assign({}, rollupConfig);
  rConfig.cache = cache;
  return rollup(rConfig).then(function(bundle) {
    cache = bundle;
    return bundle.write({
      format: 'iife',
      sourceMap: true,
      dest: gulpConfig.buildPath + '/scripts/main.js',
      moduleName: 'globeInteractiveInit'
    });
  });
});
