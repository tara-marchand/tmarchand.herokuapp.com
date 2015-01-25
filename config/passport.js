var passport = require("passport");
var TwitterStrategy = require("passport-twitter").Strategy;

var secrets = require("./secrets");
var User = require("../models/User");

passport.serializeUser(function(user, done) {
    console.log("serializeUser");
    done(null, user.uid);
});

passport.deserializeUser(function(uid, done) {
    console.log("deserializeUser");
    User.findOne({
        uid: uid
    }, function(err, user) {
        done(err, user);
    });
});

passport.use(new TwitterStrategy({
        consumerKey: secrets.twitter.consumerKey,
        consumerSecret: secrets.twitter.consumerSecret,
        callbackURL: secrets.root + "/auth/twitter/callback"
    },
    function(req, token, tokenSecret, profile, done) {
        if (req.user) {
            User.findOne({
                uid: profile.id
            }, function(err, existingUser) {
                if (existingUser) {
                    req.flash("errors", { msg: "There's already a Twitter account that belongs to you. Sign in with that account, or delete it, then link it with your current account." });
                    done(err);
                } else {
                    User.findById(req.user.uid, function(err, user) {
                        user.provider = "twitter";
                        user.uid = profile.id;
                        user.name = profile.displayName;
                        user.image = profile._json.profile_image_url;
                        user.save(function(err) {
                            req.flash("info", { msg: "Twitter account has been linked." });
                            done(err, user);
                        });
                    });
                }
            });
        } else {
            User.findOne({
                uid: profile.id
            }, function(err, existingUser) {
                if (existingUser) {
                    done(null, existingUser);
                } else {
                    var user = new User();
                    user.provider = "twitter";
                    user.uid = profile.id;
                    user.name = profile.displayName;
                    user.image = profile._json.profile_image_url;
                    user.save(function(err) {
                        done(err, user);
                    });
                }
            });
        }
    })
);

/* authorization required middleware */
exports.requireRole = function(role) {
    return function(req, res, next) {
        if ("user" in req) {
            console.log(req.user.role, role);
        }
        if("user" in req && req.user.role === role) {
            next();
        } else {
            res.sendStatus(403);
        }
    };
};
