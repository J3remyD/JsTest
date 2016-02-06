'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var assign = require('lodash').assign;
var babelify = require('babelify');
var browserSync = require('browser-sync');

function buildBrowserify(opt) {
  var customOpts = {
    entries: opt.entries,
    debug: true
  };
  var opts = assign({}, watchify.args, customOpts);
  return watchify(browserify(opts).transform(babelify));
}

function bundle(b, target) {
  return function () {
    return b.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({
        loadMaps: true
      }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(target));
  };
}

var b = buildBrowserify({
  entries: ['./app/src/index.js']
});

var bTest = buildBrowserify({
  entries: ['./test/search-test.js']
});

gulp.task('default', ['js', 'copyHtml']);

gulp.task('test', ['testjs', 'copyTestHtml']);

gulp.task('js', bundle(b, './dist'));

gulp.task('testjs', bundle(bTest, './test/dist'));

b.on('update', bundle(b, './dist'));
b.on('log', gutil.log);

gulp.task('js-watch', ['js', 'copyHtml'], browserSync.reload);

gulp.task('js-watch-test', ['testjs', 'copyTestHtml'], browserSync.reload);

gulp.task('serve', ['js', 'copyHtml'], function() {
  browserSync({
    notify: false,
    server: {
      baseDir: './dist',
      routes: {
        '/node_modules': './node_modules',
        '/bower_components': './bower_components'
      }
    },
    open: false,
    port: 8080,
    ghostMode: false
  });
  gulp.watch('app/**/*.js', ['js-watch']);
  gulp.watch('app/index.html', ['js-watch']);
});

gulp.task('serve:test', ['testjs', 'copyTestHtml'], function() {
  browserSync({
    notify: false,
    server: {
      baseDir: './test/dist',
      routes: {
        '/node_modules': './node_modules',
        '/bower_components': './bower_components'
      }
    },
    open: false,
    port: 8080,
    ghostMode: false
  });
  gulp.watch('app/**/*.js', ['js-watch']);
  gulp.watch('test/*.js', ['js-watch-test']);
});

gulp.task("copyHtml", function() {
  gulp.src('./app/*').pipe(gulp.dest('./dist'));
});

gulp.task("copyTestHtml", function() {
  gulp.src('./test/index.html').pipe(gulp.dest('./test/dist'));
});
