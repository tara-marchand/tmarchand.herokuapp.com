var port = Number(process.env.PORT || 5000);

var fs = require("fs");
var path = require("path");
var express = require("express");
var morgan = require("morgan");
var expressSession = require("express-session");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

var exphbs = require("express3-handlebars");
var expressState = require("express-state");
var mongoose = require("mongoose");
var passport = require("passport");
var TwitterStrategy = require("passport-twitter").Strategy;
var newrelic = require("newrelic");
var sendgrid = require("sendgrid")(
    process.env.SENDGRID_USERNAME,
    process.env.SENDGRID_PASSWORD
);

var app = express();
var Schema = mongoose.Schema;

expressState.extend(app);

app.locals.viewsdir = path.join(__dirname, "views");
app.locals.modelsdir = path.join(__dirname, "models");

/* expose config to client side */
app.set("state namespace", "tmarchand");
app.expose({
    socrataAppToken: process.env.SOCRATA_APP_TOKEN
}, "env");

app.locals.scripts = [];
app.locals.stylesheets = [];

/* Handlebars instance */
var hbs = exphbs.create({
    defaultLayout: "index",
    helpers: {
        // render script tags in layout
        scriptTags: function(scripts) {
            app.locals.scripts = [];
            if (scripts !== undefined) {
                return scripts.map(function(script) {
                    if (script.indexOf("//") > -1) {
                        return "<script src=\"" + script + "\"></script>";
                    } else {
                        return "<script src=\"" + script + "\"></script>";
                    }
                }).join("\n ");
            } else {
                return "";
            }
        },
        // add script from view
        addScript: function(script) {
            app.locals.scripts.push(script);
        },
        // render stylesheet tags in layout
        stylesheetTags: function(stylesheets) {
            app.locals.stylesheets = [];
            if (stylesheets !== undefined) {
                return stylesheets.map(function(stylesheet) {
                    return "<link rel=\"stylesheet\" href=\"" + stylesheet + "\">";
                }).join("\n ");
            }
        },
        // add stylesheet from view
        addStylesheet: function(stylesheet) {
            app.locals.stylesheets.push(stylesheet);
        }
    }
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));
app.use("/bower_components",  express.static(__dirname + "/bower_components"));

function setNavItems(req, res, next) {
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
    next();
}
app.use(setNavItems);

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(cookieParser());
app.use(expressSession({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.user = null;
    if (req.user) {
        res.locals.user = req.user;
    }
    next();
});

var UserSchema = new Schema({
    provider: String,
    uid: String,
    name: String,
    image: String,
    created: {type: Date, default: Date.now}
});

mongoose.connect(process.env.MONGOLAB_URI);
mongoose.model("User", UserSchema);
var User = mongoose.model("User");

passport.use(new TwitterStrategy({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: process.env.ROOT + "/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, done) {
        User.findOne({
            uid: profile.id
        }, function(err, user) {
            if (user) {
                done(null, user);
            } else {
                var user = new User();
                user.provider = "twitter";
                user.uid = profile.id;
                user.name = profile.displayName;
                user.image = profile._json.profile_image_url;
                user.save(function(err) {
                    if (err) {
                        throw err;
                    }
                    done(null, user);
                });
            }
        });
    })
);

passport.serializeUser(function(user, done) {
    done(null, user.uid);
});

passport.deserializeUser(function(uid, done) {
    User.findOne({
        uid: uid
    }, function(err, user) {
        done(err, user);
    });
});

/* routes */
var routes = require("./routes.js")(app, passport, sendgrid);

/* start */
app.listen(port);
console.log("server is running on port " + port);
