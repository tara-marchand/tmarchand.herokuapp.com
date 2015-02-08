var fs = require("fs");
var markdown = require("markdown").markdown;

/**
 * GET /:page
 * render Markdown or Handlebars content
 */
exports.getContent = function(req, res) {
    var getMarkdownContent = function() {
        fs.readFile(req.app.locals.viewsdir + "/" + req.params.page + ".markdown", function(err, data) {
            if (err) {
                res.render("404");
            } else {
                var dataString = data.toString();
                var markup = markdown.toHTML(dataString); // render markdown
                res.render("markdown", {
                    data: markup
                });
            }
        });
    };

    var getHandlebarsContent = function(req, res) {
        fs.readFile(req.app.locals.modelsdir + "/" + req.params.page + ".json", "utf8", function(err2, data2) {
            var model = {};
            if (!err2) {
                model = JSON.parse(data2);
            }
            res.render(req.params.page, model, function(err, html) { // render handlebars
                if (err) {
                    console.log(err);
                    res.render("404");
                } else {
                    res.end(html);
                }
            });
        });
    };

    if (req.params.page !== "favicon.ico") {
        fs.readdir(req.app.locals.viewsdir, function(err, files) {
            if (files.indexOf(req.params.page + ".markdown") > -1) {
                getMarkdownContent(req, res);
            } else {
                getHandlebarsContent(req, res);
            }
        });
    }
};
