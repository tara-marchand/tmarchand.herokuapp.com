var browserify = require('browserify');
var glob = require('glob');
var gulp = require('gulp');
var react = require('gulp-react');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var gulp = require('gulp');

/* Instagram photos w/React START */

gulp.task('photos-bundle', function() {
    'use strict';

    var browserifyBundle = browserify();
    browserifyBundle.require('superagent');
    browserifyBundle.require('react');
    browserifyBundle.require('react-async');
    browserifyBundle.bundle()
        .pipe(source('photos-bundle.js'))
        .pipe(gulp.dest('./public/scripts/photos'));
});

gulp.task('photos-react-server', function() {
    'use strict';

    return gulp.src('./views/jsx/photos.jsx')
        .pipe(react())
        .pipe(rename('react-server.js'))
        .pipe(gulp.dest('./public/scripts/photos'));
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
        .pipe(source('react-browser.js'))
        .pipe(gulp.dest('./public/scripts/photos'));
    })
    .bundle()
    .pipe(source('react-browser.js'))
    .pipe(gulp.dest('./public/scripts/photos'));
});

/* Instagram photos w/React END */

// gulp.task('lib', function() {
//     'use strict';

//     browserify()
//         .require(['jquery', 'underscore', 'backbone', 'firebase'])
//         .bundle()
//         .pipe(source('lib.js'))
//         .pipe(gulp.dest('./public/scripts/contractors'));
// });

// gulp.task('app', function() {
//     'use strict';

//     browserify([ './public/scripts/contractors/app-src.js' ])
//         .external(['jquery', 'underscore', 'backbone', 'firebase', 'backbonefire'])
//         .bundle()
//         .pipe(source('app-dist.js'))
//         .pipe(gulp.dest('./public/scripts/contractors'));
// });

// gulp.task('contractors', ['lib', 'app']);

gulp.task('watch', ['photos-react-server', 'photos-browserify-bundle', 'photos-react-browser'], function() {
    'use strict';

    gulp.watch('views/jsx/**/*.jsx', ['photos-react-server', 'photos-react-browser']);
});
