var gulp = require('gulp'),
  del = require('del'),
  plumber = require('gulp-plumber'),
  jeditor = require('gulp-json-editor'),
  preprocess = require('gulp-preprocess'),
  rename = require('gulp-rename'),
  size = require('gulp-size'),
  fs = require('fs'),
  gutil = require('gulp-util'),
  jsonMinify = require('gulp-jsonminify'),
  imagemin = require('gulp-imagemin'),
  handlebars = require('gulp-compile-handlebars'),
  gulpConfig = require('./gulp.config.js');

gulp.task('_set-dev-node-env', function() {
  return process.env.NODE_ENV = 'development';
});

gulp.task('_set-prod-node-env', function() {
  return process.env.NODE_ENV = 'production';
});

gulp.task('_set-env-vars', function(done) {
  process.env.SLUG = gulpConfig.slug;
  process.env.BUILD = gulpConfig.build;
  process.env.GRAPHICS_PATH = (process.env.NODE_ENV === 'production') ? gulpConfig.graphicsRemotePath + gulpConfig.slug : '.';
  done();
});

gulp.task('_clean-lib', function() {
  return del([gulpConfig.buildPath + '/**/*']);
});

gulp.task('_increment-build', function() {
  return gulp.src('./package.json')
    .pipe(jeditor(pkg => {
      var num = Number(pkg.build);
      pkg.build = (num + 1).toString();
      return pkg;
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('_process-html', function() {

  var archieFile = JSON.parse(fs.readFileSync(gulpConfig.archieData, 'utf8')),
    archie = gulpConfig.googleDoc === '' ? gutil.noop() : handlebars(archieFile);

  return gulp.src(gulpConfig.srcTemplates + '/development.html')
    .pipe(preprocess({ context: process.env }))
    .pipe(plumber())
    .pipe(archie)
    .pipe(gulp.dest(gulpConfig.buildPath));
});

gulp.task('_process-html-build', function() {

  var archieFile = JSON.parse(fs.readFileSync(gulpConfig.archieData, 'utf8')),
    archie = gulpConfig.googleDoc === '' ? gutil.noop() : handlebars(archieFile);

  return gulp.src(gulpConfig.srcTemplates + '/production.html')
    .pipe(preprocess({ context: process.env }))
    .pipe(archie)
    .pipe(rename(gulpConfig.slug + '.html'))
    .pipe(gulp.dest(gulpConfig.buildPath));
});

gulp.task('_process-data', function() {
  return gulp.src([gulpConfig.srcData + '/*', '!' + gulpConfig.srcData + '/archie.json'])
    .pipe(gulp.dest(gulpConfig.buildPath + '/data'));
});

gulp.task('_process-data-build', function() {
  return gulp.src([gulpConfig.srcData + '/*', '!' + gulpConfig.srcData + '/archie.json'])
    .pipe(jsonMinify())
    .pipe(gulp.dest(gulpConfig.buildPath + '/data'));
});

gulp.task('_process-images', function() {
  return gulp.src(gulpConfig.srcImages + '/*')
    .pipe(gulp.dest(gulpConfig.buildPath + '/images'));
});

gulp.task('_process-images-build', function() {
  return gulp.src(gulpConfig.srcImages + '/*')
    .pipe(imagemin())
    .pipe(gulp.dest(gulpConfig.buildPath + '/images'));
});

gulp.task('_build-size', function() {
  return gulp.src(gulpConfig.buildPath + '/**/*')
    .pipe(size({ title: 'Build', gzip: true, showFiles: true }));
});
