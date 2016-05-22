var gulp = require('gulp'),
  sass          = require('gulp-ruby-sass'),
  autoprefixer  = require('gulp-autoprefixer'),
  minifycss     = require('gulp-minify-css'),
  jshint        = require('gulp-jshint'),
  uglify        = require('gulp-uglify'),
  imagemin      = require('gulp-imagemin'),
  concat        = require('gulp-concat'),
  changed       = require('gulp-changed'),
  livereload    = require('gulp-livereload'),
  del           = require('del');

// CSS - SASS, autoprefixer, minify
gulp.task('styles', function () {
  sass('src/assets/scss/main.scss', { style: 'expanded' })
    .pipe(autoprefixer({
      browsers: ['last 5 versions']
    }))
    .pipe(minifycss())
    .pipe(gulp.dest('target/assets/css'))
    .pipe(livereload());
});

// JS - JS hint, concat, minify
gulp.task('scripts', function () {
  gulp.src([
    './src/assets/js/lib/jquery.js',
    './src/assets/js/lib/console.js',
    './src/assets/js/lib/*.js',
    './src/assets/js/src/*.js',
    '!./src/assets/js/lib/modernizr.js',
    '!./src/assets/js/src/blank.js'
  ])
    .pipe(jshint.reporter('jshint-summary', {
      verbose: true,
      reasonCol: 'blue,bold',
      positionCol: 'grey',
      statistics: true
    }))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('target/assets/js'))
    .pipe(livereload());
  gulp.src('./src/assets/js/lib/modernizr.js')
    .pipe(gulp.dest('target/assets/js'));
});

// Compress images
gulp.task('images', function () {
  gulp.src('src/assets/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('target/assets/images'));
});

// Copy files
gulp.task('copyfiles', function () {
  gulp.src('./src/**/*.{html,php,txt,xml,eot,svg,ttf,woff}')
    .pipe(changed('target'))
    .pipe(gulp.dest('target'))
    .pipe(livereload());
});

// Clean
gulp.task('clean', function (cb) {
  del(['target/*'], cb);
});

// Watch
gulp.task('watch', function () {
  livereload.listen();
  gulp.watch('src/assets/scss/**/*.scss', ['styles']);
  gulp.watch('src/assets/js/**/*.js', ['scripts']);
  gulp.watch('./src/**/*.{html,php,txt}', ['copyfiles']);
});

// Default task
gulp.task('default', ['clean'], function () {
  gulp.start('styles', 'scripts', 'copyfiles', 'images', 'watch');
});
