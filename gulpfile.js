'use strict';

var gulp = require('gulp'),
  runSequence = require('run-sequence');

var css = require('./gulp/css.js'),
  browser = require('./gulp/browser-sync.js'),
  utils = require('./gulp/utils.js'),
  deploy = require('./gulp/deploy.js'),
  script = require('./gulp/script.js'),
  archie = require('./gulp/archie.js');

  gulp.task('default', function(done) {
    runSequence(
      '_set-dev-node-env',
      '_set-env-vars',
      '_fetch-archieml',
      '_watch-archieml',
      '_browsersync',
      done
    );
  });

gulp.task('build', function(done) {
  runSequence(
    '_set-prod-node-env',
    '_set-env-vars',
    '_clean-lib',
    '_increment-build',
    '_fetch-archieml',
    ['_rollup-build', '_scss-build', '_process-images-build', '_process-data-build'],
    '_process-html-build',
    '_build-size',
    done
  );
});

gulp.task('deploy', function(done) {
  runSequence(
    '_set-prod-node-env',
    '_deploy',
    done
  );
});
