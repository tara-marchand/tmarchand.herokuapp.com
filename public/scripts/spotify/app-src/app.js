var SpotifySongsCollection = require('./SpotifySongsCollection.js');
var AppView = require('./AppView.js');

module.exports = (function() {
    'use strict';

    var Spotify = {};

    Spotify.songsCollection = new SpotifySongsCollection();
    Spotify.appView = new AppView({ collection: Spotify.songsCollection });
})();
