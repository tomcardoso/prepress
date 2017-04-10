var gulp = require('gulp'),
  gulpConfig = require('./gulp.config.js'),
  gitignore = require('gulp-gitignore'),
  gulpDropbox = require('gulp-dropbox');

gulp.task('_deploy', function() {
  return gulp.src(gulpConfig.buildPath + '/**/*')
    .pipe(gitignore())
    .pipe(gulpDropbox({
      token: process.env.DROPBOX_ACCESS_TOKEN,
      path: gulpConfig.dropboxPath,
      folder: gulpConfig.slug
    }));
});
