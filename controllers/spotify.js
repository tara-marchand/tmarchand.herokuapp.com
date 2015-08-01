var superagent = require('superagent');
var secrets = require('../config/secrets');

/**
 * GET /spotify
 * Spotify songs page
 */
exports.spotifyHome = function(req, res) {
    'use strict';
    // render photos server-side with React
    superagent.get('https://api.spotify.com/v1/tracks?ids=7ouMYWpwJ422jRcDASZB7P,4VqPOruhp5EdPBeR92t6lQ,2takcwOaAZWiXQijPHIx7B&market=ES')
    // superagent.get('https://api.instagram.com/v1/users/3007/media/recent/?client_id=' + secrets.spotify.clientId + '&count=12')
        .end(function(err, res2) {
            if (err && err.code === 'ECONNREFUSED') {
                console.error('Refused connection');
            }

            var songs = res2.body.tracks;

            res.render('spotify', {
                jsonifiedSongs: JSON.stringify(songs)
            }, function(err, html) { // render handlebars
                if (err) {
                    console.log(err);
                    res.render('404');
                } else {
                    res.end(html);
                }
            });
        });
};
