'use strict';

// http://macr.ae/article/splitting-gulpfile-multiple-files.html (approach 2)

var config = {
    nodeDir: './node_modules',
    scriptsDir: './public/scripts',
    tempDir: './temp'
};

// not gulp plugins
var modules = {
    browserify: require('browserify'),
    del: require('del'),
    fs: require('fs'),
    glob: require('glob'),
    vinylSourceStream: require('vinyl-source-stream'),
    watchify: require('watchify')
};

// gulp and plugins
var gulp = require('gulp');
var gulpPlugins = require('gulp-load-plugins')({ scope: 'devDependencies' });

function getTask(task) {
    return require('./gulp-tasks/' + task)(gulp, gulpPlugins, modules, config);
}

gulp.task('sass', getTask('sass'));

gulp.task('watch', ['sass'], function() {
    gulp.watch('sass/**/*.scss', ['sass']);
});
