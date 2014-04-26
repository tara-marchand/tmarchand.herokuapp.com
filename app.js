var port = Number(process.env.PORT || 5000);
var fs = require("fs");
var path = require("path");

var express = require("express");
var exphbs = require("express3-handlebars");
var app = express();
var routes = require("./routes");

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ConnectRoles = require("connect-roles");
var roles = new ConnectRoles();
var passport = require("passport");
var TwitterStrategy = require("passport-twitter").Strategy;
var sendgrid = require("sendgrid")(
  process.env.SENDGRID_USERNAME,
  process.env.SENDGRID_PASSWORD
);
var newrelic = require("newrelic");

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
// add user to all routes
app.use(function (req, res, next) {
	res.locals({
		get user() { // as a getter to delay retrieval until `res.render()`
			return req.user;
		},
		isAuthenticated: function () {
			return req.user !== null;
		}
	});
	next();
});
app.use(express.logger("dev"));
app.use(app.router);

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

var setNavItems = function() {
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

/* authorization */
roles.use(function (req) {
	if (req.user.role === "admin") {
		return true;
	}
});

/* routes */
app.get("/", routes.index);
app.get("/admin", routes.admin.index);
app.get("/auth/twitter", passport.authenticate("twitter"), function(req, res) {
});
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
app.post("/contact/send", routes.contact.send);
app.get("/:page", routes.page);

/* start */
app.listen(port);
console.log("server is running on port " + port);
