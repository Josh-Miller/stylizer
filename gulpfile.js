var gulp = require('gulp'),
    glob = require('glob'),
    path = require('path'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    _ = require('lodash');

/**
 * Bundle JS
 */
gulp.task('bundle', function(cb) {
  glob(__dirname + '/core/js/*.js', function(er, files) {
    files.forEach(function(file) {
      var basename = path.basename(file);
      browserify(file)
        .bundle()
        .pipe(source(basename))
        .pipe(gulp.dest(__dirname + '/public/stylizer/js'));
    });
    cb(er);
  });
});
