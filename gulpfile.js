var gulp = require('gulp');
var react = require('gulp-react');
var rename = require('gulp-rename');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

gulp.task('server-react', function() {
    'use strict';
    return gulp.src('./views/jsx/**/*.jsx')
        .pipe(react())
        .pipe(rename({
            suffix: '-server'
        }))
        .pipe(gulp.dest('./public/scripts'));
});

gulp.task('client-react', function() {
    'use strict';
    return browserify({
            entries: ['./views/jsx/**/*.jsx'],
            transform: ['reactify'],
            extensions: ['.jsx']
        }).bundle()
        .pipe(source())
        .pipe(rename({
            suffix: '-client'
        }))
        .pipe(gulp.dest('./public/scripts'));
});

gulp.task('watch', function() {
    'use strict';
    gulp.watch('views/jsx/**/*.jsx', ['server-react', 'client-react']);
});
