/* require */
var newrelic = require("newrelic");
var fs = require("fs");
var express = require("express");
var exphbs = require("express3-handlebars");
var path = require("path");
var app = express();
var port = Number(process.env.PORT || 5000);
var sendgrid = require("sendgrid")(
  process.env.SENDGRID_USERNAME,
  process.env.SENDGRID_PASSWORD
);
var routes = require("./routes");

var mongoose = require("mongoose");
var passport = require("passport");
var TwitterStrategy = require("passport-twitter").Strategy;

app.engine("handlebars", exphbs({
    defaultLayout: "index"
}));
app.set("view engine", "handlebars");
app.locals.viewsdir = path.join(__dirname, "views");

app.use(express.static(__dirname + "/public"));
app.use("/bower_components",  express.static(__dirname + "/bower_components"));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.logger("dev"));
app.use(app.router);

passport.serializeUser(function(user, done) {
    "use strict";
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    "use strict";
    done(null, obj);
});

passport.use(new TwitterStrategy({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: process.env.ROOT + "/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, done) {
        "use strict";
        process.nextTick(function () {
            return done(null, profile);
        });
    }
));

var setNavItems = function() {
    "use strict";
    var navItems = [];
    var stringsToExclude = ["index", "404", "markdown"];
    var path = __dirname + "/views";
    var files = fs.readdirSync(path);

    var file;
    var fileNoExt;
    var filePath;
    var fileStats;
    for (var i in files) {
        file = files[i];
        fileNoExt = file.replace(".handlebars", "").replace(".markdown", "");
        filePath = path + "/" + file;
        fileStats = fs.statSync(filePath);
        if (fileStats.isFile() && stringsToExclude.indexOf(fileNoExt) === -1 && fileNoExt[0] !== ".") {
            navItems.push(fileNoExt);
        }
    }
    app.set("navItems", navItems);
};

setNavItems();

/* routes */
app.get("/", routes.index);
app.get("/auth", routes.auth.index);
app.get("/auth/twitter", routes.auth.twitter.index);
app.get("/auth/twitter/callback", routes.auth.twitter.callback);
app.post("/contact/send", routes.contact.send);
app.get("/:page", routes.page);

/* start */
app.listen(port);
console.log("server is running on port " + port);
