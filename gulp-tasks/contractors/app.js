'use strict';

module.exports = function (gulp, gulpPlugins, modules, config) {
    return function () {
        var contractorsDir = config.scriptsDir + '/contractors';

        modules.browserify({
                debug: true,
                exclude: ['jquery', 'underscore', 'backbone', 'firebase'],
                entries: contractorsDir + '/app-src/app.js'
            })
            .bundle()
            .pipe(modules.vinylSourceStream('contractors-app.js'))
            .pipe(gulp.dest(contractorsDir));
    };
};
