'use strict';

var superagent = require('superagent');

/**
 * GET /spotify
 * Spotify songs page
 */
exports.spotifyHome = function(req, res) {
    // render photos server-side with React
    superagent.get('https://api.spotify.com/v1/tracks?ids=7ouMYWpwJ422jRcDASZB7P,4VqPOruhp5EdPBeR92t6lQ,2takcwOaAZWiXQijPHIx7B&market=ES')
        .end(function(err, res2) {
            if (err && err.code === 'ECONNREFUSED') {
                console.error('Refused connection');
            }
            var songs = res2.res.body.tracks;
            res.render('spotify', {
                jsonifiedSongs: JSON.stringify(songs)
            }, function(err2, html) { // render handlebars
                if (err2) {
                    console.log(err2);
                    res.render('404');
                } else {
                    res.end(html);
                }
            });
        });
};
