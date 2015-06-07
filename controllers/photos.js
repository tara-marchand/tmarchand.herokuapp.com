var superagent = require('superagent');
var secrets = require('../config/secrets');
var React = require('react');

/**
 * GET /photos
 * photos page
 */
exports.photosHome = function(req, res) {
    'use strict';

    // render photos server-side with React
    superagent.get('https://api.instagram.com/v1/users/3007/media/recent/?client_id=' + secrets.instagram.clientId + '&count=12')
        .end(function(err, res2) {
            if (err && err.code === 'ECONNREFUSED') {
                console.error('Refused connection');
            }

            var images = res2.body.data;
            var instagram = require('../public/scripts/photos/photos-server');
            var instagramImageList = React.createFactory(instagram.InstagramImageList);
            var renderedList = React.renderToString(instagramImageList({ 
                images: images,
                initialCount: 0
            }));

            res.render('photos', {
                jsonifiedImages: JSON.stringify(images),
                imageList: renderedList
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

