var gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass'),
  csso = require('gulp-csso'),
  postCss = require('gulp-postcss'),
  rename = require('gulp-rename'),
  sourcemaps = require('gulp-sourcemaps'),
  autoPrefixer = require('autoprefixer');

var gulpConfig = require('./gulp.config.js');

var sourceCss = gulpConfig.srcStylesheets + '/*.scss';
var buildCss = gulpConfig.buildPath + '/style';

var sassOptions = {
  var: [
    require('bourbon').includePaths,
    require('bourbon-neat').includePaths
  ],
  onError: console.error.bind(console, 'SCSS error:')
};

var autoprefixerOptions = {
  browsers: ['last 1 version']
};

gulp.task('_scss', function() {
  return gulp.src(sourceCss)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass(sassOptions))
    .pipe(postCss([
      autoPrefixer(autoprefixerOptions)
    ]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(buildCss));
});

gulp.task('_scss-build', function() {
  return gulp.src(gulpConfig.srcStylesheets + '/main.scss')
    .pipe(sass(sassOptions))
    .pipe(postCss([
      autoPrefixer(autoprefixerOptions)
    ]))
    .pipe(csso({ debug: true }))
    .pipe(rename(gulpConfig.buildCssFilename))
    .pipe(gulp.dest(buildCss));
});
