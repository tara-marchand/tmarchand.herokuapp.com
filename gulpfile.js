/* eslint-env node */

'use strict';

var browserify = require('browserify');
var glob = require('glob');
var gulp = require('gulp');
var react = require('gulp-react');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var autoprefixer = require('gulp-autoprefixer');
var mocha = require('gulp-mocha');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var del = require('del');

var config = {
    sassDir: './sass/',
    nodeDir: './node_modules/',
    contractorsDir: './public/scripts/contractors/'
};

/* CSS */

gulp.task('sass', function() {
    gulp.src(config.sassDir + '**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./public/stylesheets'));
});

/* JS */

gulp.task('sfdata', function() {
    gulp.src([
        /* main view */
        'public/scripts/sfdata/src/app.js',
        /* models and their views */
        'public/scripts/sfdata/src/map.js',
        'public/scripts/sfdata/src/businesses.js',
        /* initialization */
        'public/scripts/sfdata/src/init.js'
    ])
    .pipe(concat('app.temp.js'))
    .pipe(gulp.dest('public/scripts/sfdata/dist'))
    .pipe(rename('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/scripts/sfdata/dist'));

    // delete temporary file
    del('public/scripts/sfdata/dist/app.temp.js');
});

gulp.task('ember-lib', function() {
    var browserifyBundle = browserify();
    browserifyBundle.require('jquery');
    // browserifyBundle.require('handlebars');
    // browserifyBundle.require('ember');
    browserifyBundle.require('ember-data');
    browserifyBundle.require('ember-localstorage-adapter');
    browserifyBundle.bundle()
        .pipe(source('lib.js'))
        .pipe(gulp.dest('./public/scripts/ember'));
});

/* Instagram photos w/React */

gulp.task('photos-lib', function() {
    var browserifyBundle = browserify();
    browserifyBundle.require('superagent');
    browserifyBundle.require('react');
    browserifyBundle.require('react-async');
    browserifyBundle.bundle()
        .pipe(source('photos-lib.js'))
        .pipe(gulp.dest('./public/scripts/photos'));
});

gulp.task('photos-server', function() {
    return gulp.src('./public/scripts/photos/photos.jsx')
        .pipe(react())
        .pipe(rename('photos-server.js'))
        .pipe(gulp.dest('./public/scripts/photos'));
});

gulp.task('photos-browser', function() {
    var reactFiles = glob.sync('./public/scripts/photos/photos.jsx');
    var bundler = browserify({
            entries: reactFiles,
            transform: ['reactify'],
            extensions: ['.jsx']
        })
        .exclude('superagent')
        .exclude('react')
        .exclude('react-async');
    var watcher = watchify(bundler);
    return watcher.on('update', function() {
        watcher.bundle()
        .pipe(source('photos-browser.js'))
        .pipe(gulp.dest('./public/scripts/photos'));
    })
    .bundle()
    .pipe(source('photos-browser.js'))
    .pipe(gulp.dest('./public/scripts/photos'));
});

gulp.task('photos-jsx', ['photos-server', 'photos-browser']);

gulp.task('contractors', function() {
    browserify({
            debug: true,
            exclude: ['jquery', 'underscore', 'backbone', 'firebase'],
            entries: config.contractorsDir + 'app-src/app.js'
        })
        .bundle()
        .pipe(source('contractors-app.js'))
        .pipe(gulp.dest(config.contractorsDir));
});

gulp.task('contractors-test', function() {
    return gulp.src('public/scripts/contractors/app-test.js')
        .pipe(mocha({ globals: ['Backbone'] }));
});

gulp.task('watch', ['sass', 'photos-jsx', 'sfdata'], function() {
    gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch('views/jsx/**/*.jsx', ['photos-jsx']);
    gulp.watch('public/scripts/contractors/app-src/**/*.js', ['contractors-test']);
    gulp.watch('public/scripts/spotify/app-src/**/*.js', ['spotify']);
    gulp.watch('public/scripts/sfdata/src/*.js', ['sfdata']);
});
