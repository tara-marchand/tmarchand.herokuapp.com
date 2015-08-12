'use strict';

module.exports = function (gulp, gulpPlugins, modules, config) {
    return function () {
        var sfDataDir = config.scriptsDir + '/sfdata';

        gulp.src([
            // main view
            sfDataDir + '/src/app.js',
            // models and their views
            sfDataDir + '/src/map.js',
            sfDataDir + '/src/notices.js',
            // initialization
            sfDataDir + '/src/init.js'
        ])
        .pipe(gulpPlugins.concat('app.temp.js'))
        .pipe(gulp.dest(config.tempDir))
        .pipe(gulpPlugins.rename('app.min.js'))
        .pipe(gulpPlugins.uglify())
        .pipe(gulp.dest(sfDataDir))
        // delete temporary file
        .on('end', function (callback) {
            modules.del(config.tempDir + '/app.temp.js', callback);
        });
    };
};
