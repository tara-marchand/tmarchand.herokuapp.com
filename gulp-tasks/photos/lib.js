'use strict';

module.exports = function (gulp, gulpPlugins, modules, config) {
    return function () {
        var browserifyBundle = modules.browserify();

        browserifyBundle.require('superagent');
        browserifyBundle.require('react');
        browserifyBundle.require('react-async');
        browserifyBundle.bundle()
            .pipe(modules.vinylSourceStream('photos-lib.js'))
            .pipe(gulp.dest(config.scriptsDir + '/photos'));
    };
};
