/* require */
var fs = require("fs");
var express = require("express");
var exphbs = require("express3-handlebars");
var app = express();
var port = Number(process.env.PORT || 5000);
var sendgrid  = require("sendgrid")(
  process.env.SENDGRID_USERNAME,
  process.env.SENDGRID_PASSWORD
);

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));
app.use("/bower_components",  express.static(__dirname + "/bower_components"));
app.use(express.bodyParser());

var getViewNamesInPath = function(path) {
    var files = fs.readdirSync(path);
    var file;
    var fileStats;
    var items = [];
    for (var i in files) {
        file = path + "/" + files[i];
        fileStats = fs.statSync(file);
        if (fileStats.isFile()) {
            //console.log(viewFiles[i].replace(".handlebars", ""));
            items.push(files[i].replace(".handlebars", ""));
        }
    }
    return items;
};

var setNavItems = function() {
    var navItems = getViewNamesInPath(__dirname + "/views");
    for (var i = navItems.length - 1; i >= 0; i--) {
        if (navItems[i] === 'home') {
            navItems.splice(i, 1);
        }
    }
    app.set('navItems', navItems);
};

setNavItems();

/* routes */
app.get("/", function (req, res) {
    res.render("home");
});

app.get("/resume", function (req, res) {
    res.render("resume");
});

app.get("/contact", function (req, res) {
    res.render("contact");
});

app.post("/contact/send", function (req, res) {
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

/* start */
app.listen(port);
console.log("server is running on port " + port);
