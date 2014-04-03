var fs = require("fs");
var markdown = require("markdown").markdown;

exports.index = function(req, res){
    "use strict";
    res.render("home");
};

exports.contact = {};

exports.contact.send = function (req, res) {
    "use strict";
    var from = req.body.from;
    var subject = req.body.subject;
    var message = req.body.message;

    sendgrid.send({
        to: "tara@mac.com",
        from: from,
        subject: subject,
        text: message
    }, function(err, json) {
        if (err) {
            return console.error(err);
        }
        if (json.message === "success") {
            res.redirect("/");
        }
    });
};

exports.page = function (req, res) {
    "use strict";
    if (req.params.page !== "favicon.ico") {
        fs.readdir(req.app.locals.viewsdir, function(err, files) {
            if (files.indexOf(req.params.page + ".markdown") > -1) {
                fs.readFile(req.app.locals.viewsdir + "/" + req.params.page + ".markdown", function(err, data) {
                    if (err) {
                        res.render("404");
                    } else {
                        var markup = markdown.toHTML(data.toString()); // render markdown
                        res.render("markdown", {
                            data: markup
                        });
                    }
                });
            } else {
                res.render(req.params.page, {}, function(err, html) { // render handlebars
                    if (err) {
                        res.render("404");
                    } else {
                        res.end(html);
                    }
                });
            }
        });
    }
};
