'use strict';

module.exports = function (gulp, gulpPlugins, modules, config) {
    return function () {
        var photosDir = config.scriptsDir + '/photos';
        var reactFiles = modules.glob.sync(photosDir + '/photos.jsx');
        var bundler = modules.browserify({
                entries: reactFiles,
                transform: ['reactify'],
                extensions: ['.jsx']
            })
            .exclude('superagent')
            .exclude('react')
            .exclude('react-async');
        // var watcher = modules.watchify(bundler);
        // watcher.on('update', function() {
        //     watcher.bundle()
        //     .pipe(modules.vinylSourceStream('photos-browser.js'))
        //     .pipe(gulp.dest(photosDir));
        // })
        bundler.bundle()
            .pipe(modules.vinylSourceStream('photos-browser.js'))
            .pipe(gulp.dest(photosDir));
    };
};
