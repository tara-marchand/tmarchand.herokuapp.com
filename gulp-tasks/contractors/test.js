'use strict';

module.exports = function (gulp, gulpPlugins, modules, config) {
    return function () {
        gulp.src(config.scriptsDir + '/contractors/app-test.js')
            .pipe(gulpPlugins.mocha({ globals: ['Backbone'] }));
    };
};
