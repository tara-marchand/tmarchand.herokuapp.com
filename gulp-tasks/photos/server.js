'use strict';

module.exports = function (gulp, gulpPlugins, modules, config) {
    return function () {
        var photosDir = config.scriptsDir + '/photos';

        gulp.src(photosDir + '/photos.jsx')
            .pipe(gulpPlugins.react())
            .pipe(gulpPlugins.rename('photos-server.js'))
            .pipe(gulp.dest(photosDir));
    };
};
