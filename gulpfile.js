var gulp = require('gulp');
var http = require('http');
var ecstatic = require('ecstatic');
var browserify = require('gulp-browserify');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var paths = {
      scripts: ['./source/js/main.js'],
      pages: ['./source/**/*.jade', '!./source/layouts/**'],
      layouts: ['./source/layouts/**/*.jade'],
      scss: ['./source/css/**/*.scss', '!./source/css/vendor/**/*.scss'],
    };

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(browserify())
    .pipe(gulp.dest('build/js'));
});

gulp.task('scss', function () {
  return gulp.src('css/main.scss')
    .pipe(sass({errLogToConsole: true}))
    .pipe(gulp.dest('build/css'));
});

gulp.task('pages', function() {
  return gulp.src(paths.pages)
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest('build'))
});

gulp.task('server', function() {
  http.createServer(
    ecstatic({ root: __dirname + '/build' })
  ).listen(8080);
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.scss, ['scss']);
  gulp.watch(paths.pages, ['pages']);
  gulp.watch(paths.layouts, ['pages']);
});

gulp.task('default', ['scripts', 'scss', 'pages', 'server', 'watch']);
