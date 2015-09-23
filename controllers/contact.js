'use strict';

var secrets = require('../config/secrets');
var winston = require('winston');

var sendgrid = require('sendgrid')(
    secrets.sendgrid.user,
    secrets.sendgrid.password
);

/**
 * GET /contact
 * contact form page
 */
exports.getContact = function(req, res) {
    res.render('contact', {}, function(err, html) {
        if (err) {
            winston.log(err);
            res.render('404');
        } else {
            res.end(html);
        }
    });
};

/**
 * POST /contact
 * send a contact form via SendGrid
 */
exports.postContact = function(req, res) {
    var from = req.body.from;
    var subject = req.body.subject;
    var message = req.body.message;

    sendgrid.send({
        to: 'tara@mac.com',
        from: from,
        subject: subject,
        text: message
    }, function(err, json) {
        if (err) {
            return console.error(err);
        }
        if (json.message === 'success') {
            res.redirect('/');
        }
    });
};
