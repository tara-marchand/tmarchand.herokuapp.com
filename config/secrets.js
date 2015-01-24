module.exports = {
    mongoDb: process.env.MONGOLAB_URI,

    sessionSecret: process.env.SESSION_SECRET,

    sendgrid: {
        user: process.env.SENDGRID_USERNAME,
        password: process.env.SENDGRID_PASSWORD
    },

    twitter: {
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: "/auth/twitter/callback",
        passReqToCallback: true
    },

    socrataAppToken: process.env.SOCRATA_APP_TOKEN
};
