var fs = require("fs");
var markdown = require("markdown").markdown;

exports.index = function(req, res){
    "use strict";
    res.render("home");
};

exports.md = function(req, res) {
    "use strict";
    fs.readFile(req.app.locals.viewsdir + "/md.md", function (err, data) {
        if (err) {
            console.log(err);
            throw err;
        }
        var markup = markdown.toHTML(data.toString());
        res.render("markdown", {
            data: markup
        });
    });
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
        res.render(req.params.page, {}, function(err, html) {
            if (err) {
                res.render("404");
            } else {
                res.end(html);
            }
        });
    }
};
