var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  gulpConfig = require('./gulp.config.js'),
  script = require('./script.js'),
  utils = require('./utils.js'),
  css = require('./css.js');

gulp.task('_browserSyncWatch', ['_rollup', '_scss', '_process-data', '_process-images', '_process-html'], browserSync.reload);

gulp.task('_watch', function(done) {
  gulp.watch(gulpConfig.srcScripts + '/**/*', ['_rollup', '_browserSyncWatch']);
  gulp.watch(gulpConfig.srcStylesheets + '/**/*', ['_scss', '_browserSyncWatch']);
  gulp.watch(gulpConfig.srcData + '/**/*', ['_process-data', '_browserSyncWatch']);
  gulp.watch(gulpConfig.srcImages + '/**/*', ['_process-images', '_browserSyncWatch']);
  gulp.watch(gulpConfig.src + '/**/*.html', ['_process-html', '_browserSyncWatch']);
  done();
});

gulp.task('_browsersync', ['_watch'], function() {
  browserSync({
    port: gulpConfig.browserSyncPort,
    ui: { port: gulpConfig.browserSyncUIPort },
    // tunnel: true,
    server: {
      baseDir: './dist',
      open: true,
      index: 'development.html'
    },
    ghostMode: false
  });

});
