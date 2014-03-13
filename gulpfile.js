var gulp   = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var paths = {
  html: ['*.html'],
  scripts: ['js/**/*.js', '!js/vendor/**/*.js'],
};

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('copy', function(){
  return gulp.src(paths.html)
    .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('default', ['scripts', 'copy', 'watch']);
