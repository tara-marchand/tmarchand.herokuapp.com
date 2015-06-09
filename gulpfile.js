var browserify = require('browserify');
var glob = require('glob');
var gulp = require('gulp');
var react = require('gulp-react');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');

var config = {
    scssDir: 'scss/',
    nodeDir: 'node_modules/'
};

/* CSS */

gulp.task('scss', function() {
    'use strict';
    return sass(config.scssDir, {
            style: 'expanded',
            loadPath: [
                (config.nodeDir + 'normalize.css/normalize.css'),
                (config.nodeDir + 'bootstrap-sass/assets/stylesheets')
            ]
        }) 
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

gulp.task('watch', ['scss', 'photos-lib', 'photos-server', 'photos-browser'], function() {
    'use strict';
    // gulp.watch('views/jsx/**/*.jsx', ['photos-react-server', 'photos-react-browser']);
});
