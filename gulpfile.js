var gulp = require('gulp');

var sass = require('gulp-sass');
var minify = require('gulp-minify');
var rename = require('gulp-rename');
var sassLint = require('gulp-sass-lint');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var cmq = require('gulp-merge-media-queries');

var staticSourceBase = './assets';
var staticDestBase = './public';

var files = {
    staticSource: {
        all: staticSourceBase + '/**',
        sass: staticSourceBase + '/sass',
        img: staticSourceBase + '/img/**/*',
        js: staticSourceBase + '/js/**/*.js'
    },
    staticDest: {
        all: staticDestBase + '/**',
        css: staticDestBase + '/css',
        img: staticDestBase + '/img',
        js: staticDestBase + '/js'
    }
};

gulp.task('sass', function() {
    return gulp.src([files.staticSource.sass + '/*.scss'])
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(files.staticDest.css));
});

gulp.task('copy-images', function() {
    return gulp.src([files.staticSource.img])
        .pipe(gulp.dest(files.staticDest.img));
});

gulp.task('cmq', ['sass'], function() {
    return gulp.src([files.staticDest.css + '/**/*.css'])
        .pipe(cmq())
        .pipe(gulp.dest(files.staticDest.css));
});

gulp.task('copy-js', function() {
    return gulp.src([files.staticSource.js])
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(files.staticDest.js));
});

gulp.task('sass-lint', function() {
    return gulp.src(files.staticSource.sass + '/**/*.scss')
        .pipe(sassLint())
        .pipe(sassLint.format());
});

gulp.task('minify-css', ['sass'], function() {
    return gulp.src(files.staticDest.css + '/clement.min.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest(files.staticDest.css));
});

gulp.task('minify-js', ['copy-js'], function() {
    return gulp.src(files.staticDest.js + '/clement.min.js')
        .pipe(minify())
        .pipe(gulp.dest(files.staticDest.js));
});

gulp.task('watch', function() {
    gulp.watch(files.staticSource.sass, ['sass', 'cmq']);
    gulp.watch(files.staticSource.img, ['copy-images']);
    gulp.watch(files.staticSource.js, ['copy-js']);
});

gulp.task('minify', ['minify-css', 'minify-js']);
gulp.task('copy-assets', ['copy-images', 'copy-js']);
gulp.task('lint', ['sass-lint']);

gulp.task('default', ['sass', 'cmq', 'copy-assets', 'lint']);
