var browserify = require('browserify');
var glob = require('glob');
var gulp = require('gulp');
var react = require('gulp-react');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

gulp.task('react-browser', function() {
    'use strict';

    var browserifyBundle = browserify();
    browserifyBundle.require('react');
    browserifyBundle.bundle()
        .pipe(source('react-browser.js'))
        .pipe(gulp.dest('./public/scripts'));
});

gulp.task('react-components-server', function() {
    'use strict';

    return gulp.src('./views/jsx/**/*.jsx')
        .pipe(react())
        .pipe(rename('react-components-server.js'))
        .pipe(gulp.dest('./public/scripts'));
});

gulp.task('react-components-browser', function() {
    'use strict';

    var reactFiles = glob.sync('./views/jsx/**/*.jsx');
    var bundler = browserify({
        entries: reactFiles,
        transform: ['reactify'],
        extensions: ['.jsx'],
        exclude: 'react'
    }).external('react');
    var watcher = watchify(bundler);
    return watcher.on('update', function() {
        watcher.bundle()
        .pipe(source('react-components-browser.js'))
        .pipe(gulp.dest('./public/scripts'));
    })
    .bundle()
    .pipe(source('react-components-browser.js'))
    .pipe(gulp.dest('./public/scripts'));
});

gulp.task('watch', ['react-components-server', 'react-browser', 'react-components-browser'], function() {
    'use strict';

    gulp.watch('views/jsx/**/*.jsx', ['react-components-server']);
});
