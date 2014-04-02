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
        var viewPathNoExt = req.app.locals.viewsdir + "/" + req.params.page;
        fs.readFileSync(viewPathNoExt + ".handlebars", function (err, data) { // try handlebars
            if (err) {
                fs.readFileSync(viewPathNoExt + ".markdown", function (err, data) { // try markdown
                    // if (err) {
                    //     console.log(err);
                    //     throw err;
                    // }
                    var markup = markdown.toHTML(data.toString()); // render markdown
                    console.log(markup);
                    res.render("markdown", {
                        data: markup
                    });
                });
            }
            res.render(req.params.page, {}, function(err, html) { // render handlebars
                if (err) {
                    res.render("404");
                } else {
                    res.end(html);
                }
            });
        });
    }
};
