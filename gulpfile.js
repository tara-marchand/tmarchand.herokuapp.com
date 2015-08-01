var browserify = require('browserify');
var glob = require('glob');
var gulp = require('gulp');
var react = require('gulp-react');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var mocha = require('gulp-mocha');

var config = {
    scssDir: 'scss/',
    nodeDir: 'node_modules/',
    contractorsDir: './public/scripts/contractors/',
    spotifyDir: './public/scripts/spotify/'
};

/* CSS */

gulp.task('scss', function() {
    'use strict';
    return sass(config.scssDir, {
            style: 'expanded',
            loadPath: [
                (config.nodeDir + 'bootstrap-sass/assets/stylesheets')
            ]
        })
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('ember-lib', function() {
    'use strict';

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

gulp.task('spotify', function() {
    'use strict';
    browserify({
            debug: true,
            entries: config.spotifyDir + 'app-src/app.js'
        })
        .bundle()
        .pipe(source('spotify-app.js'))
        .pipe(gulp.dest(config.spotifyDir));
});

gulp.task('watch', ['scss', 'ember-lib', 'photos-jsx', 'spotify'], function() {
    'use strict';
    gulp.watch('scss/**/*.scss', ['scss']);
    gulp.watch('views/jsx/**/*.jsx', ['photos-jsx']);
    gulp.watch('public/scripts/contractors/app-src/**/*.js', ['contractors-test']);
    gulp.watch('public/scripts/spotify/app-src/**/*.js', ['spotify']);
});
