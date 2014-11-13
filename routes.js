module.exports = function(app, passport) {

    var fs = require("fs");
    var markdown = require("markdown").markdown;

    app.get("/", function(req, res){
        res.render("index");
    });

    app.get("/admin", requireRole("admin"), function(req, res) {
        res.render("admin/index");
    });

    app.get("/auth/twitter", passport.authenticate("twitter"), function(req, res) {});

    app.get("/auth/twitter/callback", passport.authenticate("twitter", {
            failureRedirect: "/auth"
        }), function(req, res) {
            res.redirect("/");
        }
    );

    app.get("/logout", function(req, res){
        req.logout();
        res.redirect("/");
    });

    app.post("/contact/send", function(req, res) {
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
    });

    app.get("/:page", function(req, res) {
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
                    fs.readFile(req.app.locals.modelsdir + "/" + req.params.page + ".json", "utf8", function(err2, data2) {
                        var model = {};
                        if (!err2) {
                            model = JSON.parse(data2);
                        }
                        res.render(req.params.page, model, function(err, html) { // render handlebars
                            if (err) {
                                res.render("404");
                            } else {
                                res.end(html);
                            }
                        });
                    });
                }
            });
        }
    });

};

/* role-based authorization middleware */
function requireRole(role) {
    return function(req, res, next) {
        if("user" in req && req.user.role === role) {
            next();
        } else {
            res.send(403);
        }
    };
}
