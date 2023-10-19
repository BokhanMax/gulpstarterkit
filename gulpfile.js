var  gulp = require('gulp'),
     pug = require('gulp-pug'),
     rename = require('gulp-rename');
     sass = require('gulp-sass')(require('sass'));
     watch = require('gulp-watch');
     browserSync = require('browser-sync').create();
     autoprefixer = require('gulp-autoprefixer');
     cleancss = require('gulp-clean-css');
     imagemin = require('gulp-imagemin');
     cache = require('gulp-cache');
     webp = require('gulp-webp');
     minifyCSS = require('gulp-csso'),
     concat = require('gulp-concat'),
     sourcemaps = require('gulp-sourcemaps'),
     uglify = require('gulp-uglify'),
     rimraf = require('rimraf'),
     phpconnect = require('gulp-connect-php')

gulp.task('php', function() {
    return gulp.src('./src/*.pug')
    .pipe(pug({pretty: true}))
    .pipe(rename({extname: '.php'}))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('imgmin', function() {
	return gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin({interlaced: true})))
	.pipe(gulp.dest('dist/img'))
});

gulp.task('fonts', function() {
    return gulp.src('src/fonts/**/*')
      .pipe(gulp.dest('dist/fonts'))
});

gulp.task('imgwebp', function() {
	return gulp.src('src/images/**/*')
    .pipe(imagemin())
    .pipe(webp())
	.pipe(gulp.dest('dist/img'))
});

gulp.task('html', function(){
    return gulp.src('src/*.pug')
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('css', function(){
    return gulp.src('src/sass/*.sass')
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('js', function(){
    return gulp.src('src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'dist'
      },
    })
});

gulp.task('cleandist', function (cb) {
    rimraf('./dist/css', cb);
    rimraf('./dist/js', cb);
    rimraf('./dist/fonts', cb);
    rimraf('./dist/img', cb);
    rimraf('./dist/*.html', cb);
    rimraf('./dist/*.php', cb);
});

gulp.task('watch', gulp.series('browserSync'), function() {
    gulp.watch('src/*.pug', gulp.series('html'));
    gulp.watch('src/sass/*.sass', gulp.series('css'));
    gulp.watch('src/js/*.js', gulp.series('js'));
    gulp.watch('src/images/**/*', gulp.series('imgmin'));
});

gulp.task('build', gulp.series('cleandist', 'html', 'css', 'js', 'imgmin', 'imgwebp', 'fonts'));
gulp.task('buildphp', gulp.series('cleandist', 'php', 'css', 'js', 'imgmin', 'imgwebp', 'fonts'));