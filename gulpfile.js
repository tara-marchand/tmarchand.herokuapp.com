var browserify = require('browserify');
var glob = require('glob');
var gulp = require('gulp');
var react = require('gulp-react');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

gulp.task('photos-browserify-bundle', function() {
    'use strict';

    var browserifyBundle = browserify();
    browserifyBundle.require('superagent');
    browserifyBundle.require('react');
    browserifyBundle.require('react-async');
    browserifyBundle.bundle()
        .pipe(source('photos-browserify-bundle.js'))
        .pipe(gulp.dest('./public/scripts'));
});

gulp.task('photos-react-server', function() {
    'use strict';

    return gulp.src('./views/jsx/photos.jsx')
        .pipe(react())
        .pipe(rename('photos-react-server.js'))
        .pipe(gulp.dest('./public/scripts'));
});

gulp.task('photos-react-browser', function() {
    'use strict';

    var reactFiles = glob.sync('./views/jsx/photos.jsx');
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
        .pipe(source('photos-react-browser.js'))
        .pipe(gulp.dest('./public/scripts'));
    })
    .bundle()
    .pipe(source('photos-react-browser.js'))
    .pipe(gulp.dest('./public/scripts'));
});

gulp.task('watch', ['photos-react-server', 'photos-browserify-bundle', 'photos-react-browser'], function() {
    'use strict';

    gulp.watch('views/jsx/**/*.jsx', ['photos-react-server', 'photos-react-browser']);
});
