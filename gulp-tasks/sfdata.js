'use strict';

module.exports = function (gulp, gulpPlugins, modules, config) {
    var sfDataDir = config.scriptsDir + '/sfdata';

    try {
        // delete previous minified file, if it exists
        var minStats = modules.fs.statSync(sfDataDir + '/app.min.js');
        if (minStats.isFile()) {
            modules.fs.unlinkSync(sfDataDir + '/app.min.js');
        }
    } catch(e) {}

    return function () {
        gulp.src([
            // main view
            sfDataDir + '/src/app.js',
            // models and their views
            sfDataDir + '/src/map.js',
            sfDataDir + '/src/graffiti.js',
            // initialization
            sfDataDir + '/src/init.js'
        ])
        .pipe(gulpPlugins.concat('app.temp.js'))
        .pipe(gulp.dest(config.tempDir))
        .pipe(gulpPlugins.rename('app.min.js'))
        .pipe(gulpPlugins.uglify())
        .pipe(gulp.dest(sfDataDir))
        .on('end', function () {
            // delete temporary file
            modules.fs.unlinkSync(config.tempDir + '/app.temp.js');
        });
    };
};
