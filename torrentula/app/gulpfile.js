/*eslint-disable*/

var gulp           = require('gulp');
var browserify     = require('browserify');
var watchify       = require('watchify');
var babelify       = require('babelify');
var uglifyify      = require('uglifyify');
var sourcemaps     = require('gulp-sourcemaps');
var envify         = require('envify');
var eslint         = require('gulp-eslint');
var vinylPaths     = require('vinyl-paths');
var source         = require('vinyl-source-stream');
var buffer         = require('vinyl-buffer');
var del            = require('del');
var gulpif         = require('gulp-if');
var gutil          = require('gulp-util');
var runSequence    = require('run-sequence');
var babel          = require('gulp-babel');
var spritesmith    = require('gulp.spritesmith');
var tinylr         = require('tiny-lr');
var minCss         = require('gulp-minify-css');
var sass           = require('gulp-sass');
var concat         = require('gulp-concat');
var postCss        = require('gulp-postcss');
var autoprefixer   = require('autoprefixer-core');
var filter         = require('gulp-filter');
var zip            = require('gulp-zip');

var conf = {
  src:   ['**', '!js{/src,/src/**}', '!scss{,/**}'],
  js:    ['./src/js/*.js', './src/js/**/*.js'],
  img:   ['./src/img/**/*.{png,jpg,svg}'],
  css:   ['./src/css/**/*.css'],
  scss:  ['./src/scss/**/{!_*,*}.scss'],
  jsSrc: './src/js/src/',
  entry: ['foreground.js', 'background.js'],
  dist:  './dist/',
  distFiles: ['./dist/**'],
  spritesImages: './src/img/sprites',
  spritesCss: './src/scss/generated',
  tests: ['./tests/*.js', './tests/**/*.js'],
  testOutput: './test',
  spritesCSS: './src/css/'
};

var isProd = process.env.NODE_ENV === 'production';

gulp.task('clean', function () {
  return gulp.src([conf.dist, conf.spritesImages])
    .pipe(vinylPaths(del))
    .on('error', gutil.log);
});

gulp.task('copy', function () {
  return gulp.src(conf.src, {cwd: './src'})
    .pipe(gulp.dest(conf.dist))
    .on('error', gutil.log);
});

gulp.task('sprite', function () {
  var spriteData = gulp.src(conf.img).pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css',
    imgPath: '/img/sprites/sprite.png'
  }));

  // Pipe image stream through image optimizer and onto disk
  spriteData.img
    .pipe(gulp.dest(conf.spritesImages));

  // Pipe CSS stream through CSS optimizer and onto disk
  spriteData.css
    .pipe(gulp.dest(conf.spritesCSS));
});

gulp.task('copy-css', function() {
  //Copy over libraries
  gulp.src(conf.css)
    .pipe(gulpif(isProd, minCss()))
    .pipe(gulp.dest(conf.dist + 'css/'))
    .on('error', gutil.log);
});

gulp.task('scss', function() {
  gulp.src(conf.scss)
    .pipe(gulpif(!isProd, sourcemaps.init()))
    .pipe(sass({
      outputStyle: isProd ? 'compressed' : 'nested',
      includePaths: [require('node-bourbon').includePaths]
    }))
    .pipe(postCss([autoprefixer({
      browsers: '> 0.5%'
    })]))
    .pipe(concat('main.css'))
    .pipe(gulpif(!isProd, sourcemaps.write()))
    .pipe(gulp.dest(conf.dist + 'css/'))
    .on('error', gutil.log);
});


gulp.task('lint', function () {
  var noLib = filter(['*', '!./src/js/lib']);
  return gulp.src(conf.js)
      .pipe(noLib)
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(gulpif(isProd, eslint.failOnError()));
});

gulp.task('transpile', function () {
  conf.entry.forEach(function(entry) {

    var bundler = browserify({
        cache: {}, packageCache: {}, fullPaths: false,
        // paths: [conf.jsSrc],
        entries: [conf.jsSrc + entry],
        debug: !isProd,
        detectGlobals: true
      });

    if (!isProd) {
      bundler = watchify(bundler);
    }

    var bundle = function bundle () {
      return bundler.bundle()
          // log errors if they happen
          .on('error', gutil.log.bind(gutil, 'Browserify Error'))
          .on('error', function (error) {
            if (isProd) throw error
          })
          .pipe(source(entry))
          .pipe(buffer())
          .pipe(gulpif(!isProd, sourcemaps.init({loadMaps: !isProd}))) // loads map from browserify file
          .pipe(gulpif(!isProd, sourcemaps.write()))
          .pipe(gulp.dest(conf.dist + 'js'));
    }

    bundler.transform(babelify.configure({
      ignore: /\.scss$/,
      optional: ['es7.decorators', 'es7.classProperties']
    }));

    bundler.transform({
        global: true
    }, 'envify');

    if (isProd) {
      bundler.transform({
        global: true
      }, 'uglifyify');
    }

    bundler.add(conf.jsSrc + entry);
    bundler.on('update', bundle); // on any dep update, runs the bundler
    bundler.on('log', gutil.log); // output build logs to terminal

    bundle();
  });
});

var lr = tinylr();

gulp.task('connect', function () {
  lr.listen(35729, function(){
    console.log('TinyLR Listening on port 35729');
  });
});

gulp.task('watch', function () {
  gulp.watch(conf.js, ['lint']);
  gulp.watch('./src/**/*.{html,png,jpeg,jpg,json}', ['copy']);
  gulp.watch(conf.css, ['copy-css']);
  gulp.watch(conf.scss, ['scss']);

  gulp.watch(conf.distFiles, function(evt) {
    lr.changed({
      body:{
        files:[evt.path]
      }
    });
  });
});

gulp.task('isProdFalse', function () {
  isProd = false;
})

gulp.task('isProdTrue', function () {
  isProd = true;
})

gulp.task('zip', function(){
  return gulp.src(conf.distFiles)
    .pipe(zip('extension.zip'))
    .pipe(gulp.dest(conf.dist));
});

gulp.task('build', function(callback) {
  runSequence('clean', 'sprite', ['copy-css', 'scss'], ['lint', 'transpile'], 'copy', callback);
});

gulp.task('dev', function(callback) {
  runSequence('connect', 'build', 'watch');
})

gulp.task('default', function(callback) {
  runSequence('isProdTrue', 'build', 'zip');
});
