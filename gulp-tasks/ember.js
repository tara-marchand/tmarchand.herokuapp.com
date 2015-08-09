'use strict';

module.exports = function (gulp, gulpPlugins, modules, config) {
    return function () {
        var browserifyBundle = modules.browserify();
        browserifyBundle.require('jquery');
        browserifyBundle.require('handlebars');
        // browserifyBundle.require('ember');
        browserifyBundle.require('ember-data');
        browserifyBundle.require('ember-localstorage-adapter');
        browserifyBundle.bundle()
            .pipe(modules.vinylSourceStream('lib.js'))
            .pipe(gulp.dest(config.scriptsDir + '/ember'));
    };
};
