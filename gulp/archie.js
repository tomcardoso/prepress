var gulp = require('gulp'),
  gutil = require('gulp-util'),
  source = require('vinyl-source-stream'),
  archieml = require('gulp-archieml'),
  request = require('request'),
  file = require('gulp-file'),
  poller = require('polling-to-event'),
  buffer = require('vinyl-buffer'),
  gulpConfig = require('./gulp.config.js');

gulp.task('_fetch-archieml', function() {
  if (gulpConfig.googleDoc === '') { return; }
  return request(gulpConfig.googleDocPath, function(err, res) {
    if (err || res.statusCode != 200) {
      gutil.log('Download error: ' + err);
    }
  })
  .pipe(source('archie.json'))
  .pipe(buffer())
  .pipe(archieml())
  .pipe(gulp.dest(gulpConfig.srcData));
});

gulp.task('_watch-archieml', function() {

  if (gulpConfig.googleDoc === '') { return; }

  const interval = 15000;

  gutil.log(gutil.colors.green('Starting longpoll of ArchieML document ' + gulpConfig.googleDoc + ' every ' + (interval / 1000) + ' seconds.'));

  const emitter = poller(getArchie, {
    interval: interval,
    longpolling: true
  });

  emitter.on('longpoll', function(data) {
    gutil.log(gutil.colors.green('ArchieML template updated.'));
    return file('archie.json', data, { src: true })
      .pipe(buffer())
      .pipe(archieml())
      .pipe(gulp.dest(gulpConfig.srcData));
  });

  emitter.on('error', function(err, data) {
    gutil.log('Archie polling error: %s. with data %j', err, data);
  });

  function getArchie(done) {
    request.get(gulpConfig.googleDocPath, function(err, req, data) {
      done(err, data);
    });
  }

});
