var gulp = require('gulp'),
    hb = require('gulp-hb')
    glob = require('glob'),
    path = require('path'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    requireDir = require('require-dir'),
    build = require('gulp-build'),
    handlebars = require('gulp-handlebars'),
    _ = require('lodash'),
    header = require('gulp-header'),
    footer = require('gulp-footer'),
    injector = require('./core/compiler/injector'),
    cons = require('consolidate');

var dir = requireDir('./core/compiler');

// Compile templates
gulp.task('compile', function() {
  gulp.src(__dirname + '/src/patterns/**/**/*.html')
    .pipe(header('{{> head}}'))
    .pipe(footer('{{> footer}}'))
    .pipe(hb({
      data: './src/patterns/data/*.{js,json,yml}',
      helpers: './src/patterns/helpers/*.js',
      partials: './src/partials/*.hbs'
    }))
    .pipe(gulp.dest('./public/patterns'));
});

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

function createUri (obj, parent) {
  var tree = _.map(obj, function(e) {
    e.uri = '/' + e.name;

    if (parent != null) {
      e.uri = parent + '/' + e.name;
    }

    if (e.children != undefined) {
      createUri(e.children, e.uri);
    }
  });

  return tree;
}

// Compile templates
gulp.task('app', function() {
  var Files = require('./core/files'),
    _ = require('lodash'),
    fs = require('fs');

  var tree = Files.dirTree('./src/patterns');
  var hi = createUri(tree.children);

  gulp.src(__dirname + '/core/*.html')
    .pipe(hb({
      data: {
        menuTree: tree.children,
      },
      helpers: './src/patterns/helpers/*.js',
      partials: './core/views/partials/*.hbs'
    }))
    .pipe(gulp.dest('./public'));
});

gulp.task('build', ['app', 'bundle'], function(cb) {});

var Stylizer = require('./core/compiler/stylizer.js');
var stylizer_engine = new Stylizer;

gulp.task('stylizer', function(){

  _.forEach(stylizer_engine.config().plugins, function(n, key) {
    var plugin = require(__dirname + '/plugins/stylizer.' + n);

    stylizer_engine.add(n, plugin);
  });


  var patterns = stylizer_engine.getPatterns();

  stylizer_engine.buildFiles(patterns);
});
