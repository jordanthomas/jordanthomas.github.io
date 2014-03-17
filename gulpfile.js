var gulp   = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jade   = require('gulp-jade');
var sass   = require('gulp-sass')

var paths = {
  scripts: ['js/**/*.js', '!js/vendor/**/*.js'],
  pages: ['**/*.jade', '!layouts/**', '!node_modules/**'],
  layouts: ['layouts/**/*.jade'],
  scss: ['css/**/*.scss', '!css/vendor/*.scss']
};

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('scss', function () {
  return gulp.src(paths.scss)
    .pipe(sass())
    .pipe(gulp.dest('build/css'));
});

gulp.task('pages', function() {
  return gulp.src(paths.pages)
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest('build/'))
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.pages, ['pages']);
  gulp.watch(paths.layouts, ['pages']);
});

gulp.task('default', ['scripts', 'scss', 'pages', 'watch']);
