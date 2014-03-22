var gulp     = require('gulp'),
    http     = require('http'),
    ecstatic = require('ecstatic'),
    concat   = require('gulp-concat'),
    uglify   = require('gulp-uglify'),
    jade     = require('gulp-jade'),
    sass     = require('gulp-sass'),
    paths = {
      scripts: ['js/**/*.js', '!js/vendor/**/*.js'],
      pages: ['**/*.jade', '!layouts/**', '!node_modules/**'],
      layouts: ['layouts/**/*.jade'],
      scss: ['css/**/*.scss', '!css/vendor/**/*.scss'],
    };

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(concat('all.min.js'))
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

  console.log('Server listening on 8080...');
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.scss, ['scss']);
  gulp.watch(paths.pages, ['pages']);
  gulp.watch(paths.layouts, ['pages']);
});

gulp.task('default', ['scripts', 'scss', 'pages', 'server', 'watch']);
