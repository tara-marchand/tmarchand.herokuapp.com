/* eslint-env node */

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

var config = {
    sassDir: './sass/',
    nodeDir: './node_modules/',
    contractorsDir: './public/scripts/contractors/'
};

/* CSS */

gulp.task('sass', function() {
    'use strict';
    gulp.src(config.sassDir + 'styles.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./public/stylesheets'));
});

/* Instagram photos w/React */

gulp.task('photos-lib', function() {
    'use strict';

    var browserifyBundle = browserify();
    browserifyBundle.require('superagent');
    browserifyBundle.require('react');
    browserifyBundle.require('react-async');
    browserifyBundle.bundle()
        .pipe(source('photos-lib.js'))
        .pipe(gulp.dest('./public/scripts/photos'));
});

gulp.task('photos-server', function() {
    'use strict';

    return gulp.src('./public/scripts/photos/photos.jsx')
        .pipe(react())
        .pipe(rename('photos-server.js'))
        .pipe(gulp.dest('./public/scripts/photos'));
});

gulp.task('photos-browser', function() {
    'use strict';

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
    'use strict';
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
    'use strict';
    return gulp.src('public/scripts/contractors/app-test.js')
        .pipe(mocha({ globals: ['Backbone'] }));
});

gulp.task('watch', ['sass', 'photos-jsx'], function() {
    'use strict';
    gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch('views/jsx/**/*.jsx', ['photos-jsx']);
    gulp.watch('public/scripts/contractors/**/*-src.js', ['contractors-test']);
});
