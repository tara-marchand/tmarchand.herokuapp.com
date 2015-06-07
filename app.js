/**
 * module dependencies
 */
var fs = require('fs');
var http = require('http');
var path = require('path');
var express = require('express');
var morgan = require('morgan');
var logger = morgan('dev');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var session = require('express-session');
var flash = require('connect-flash');
var errorHandler = require('errorhandler');
var expressState = require('express-state');
var exphbs = require('express3-handlebars');

var React = require('react');
var nodeJsx = require('node-jsx').install({extension: '.jsx'});

var mongoose = require('mongoose');
var passport = require('passport');
var newrelic = require('newrelic');

/**
 * controllers (route handlers)
 */
var homeController = require('./controllers/home.js');
var userController = require('./controllers/user.js');
var adminController = require('./controllers/admin.js');
var contactController = require('./controllers/contact.js');
var photosController = require('./controllers/photos.js');
var contentController = require('./controllers/content.js');

/**
 * API keys and Passport configuration
 */
var secrets = require('./config/secrets');
var passportConfig = require('./config/passport');

/**
 * helpers
 */
var nav = require('./helpers/nav.js');

/**
 * create Express server
 */
var app = express();

/**
 * connect to MongoDB
 */
mongoose.connect(secrets.mongoDb);
mongoose.connection.on('error', function() {
    console.error('MongoDB connection error');
});

/**
 * Express configuration
 */
app.set('port', Number(process.env.PORT || 5000));
app.locals.viewsdir = path.join(__dirname, 'views');
app.locals.modelsdir = path.join(__dirname, 'models');
app.locals.scripts = [];
app.locals.stylesheets = [];
expressState.extend(app);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(multer({ dest: './admin/uploads/' }));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: secrets.sessionSecret,
    secure: false
}));
/* Passport */
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
/* static files and Bower components */
app.use('/', express.static(__dirname + '/public'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
/* nav items */
app.set('navItems', nav.getItems());
/* Handlebars */
app.set('hbs', exphbs.create({
    defaultLayout: 'index',
    helpers: {
        // render script tags in layout
        scriptTags: function(scripts) {
            app.locals.scripts = [];
            if (scripts !== undefined) {
                return scripts.map(function(script) {
                    console.dir(script);
                    if (script.type === '') {
                        return '<script src=\'' + script.name + '\'></script>';
                    } else {
                        return '<script type=\'' + script.type + '\' src=\'' + script.name + '\'></script>';
                    }
                }).join('\n ');
            } else {
                return '';
            }
        },
        // add script from view
        addScript: function(name, options) {
            if (!options.hash.type) {
                options.hash.type = '';
            }
            app.locals.scripts.push({
                name: name,
                type: options.hash.type
            });
        },
        // render stylesheet tags in layout
        stylesheetTags: function(stylesheets) {
            app.locals.stylesheets = [];
            if (stylesheets !== undefined) {
                return stylesheets.map(function(stylesheet) {
                    return '<link rel=\'stylesheet\' href=\'' + stylesheet + '\'>';
                }).join('\n ');
            }
        },
        // add stylesheet from view
        addStylesheet: function(stylesheet) {
            app.locals.stylesheets.push(stylesheet);
        }
    }
}));
app.engine('handlebars', app.get('hbs').engine);
app.set('view engine', 'handlebars');
/* expose config to client side */
app.set('state namespace', 'tmarchand');
app.expose({
    socrataAppToken: secrets.socrataAppToken
}, 'env');
app.use(function(req, res, next) {
    res.locals.user = null;
    if (req.user) {
        res.locals.user = req.user;
    }
    next();
});

/**
 * routes
 */
app.get('/', homeController.home);
app.get('/login-failed', userController.loginFailed);
app.get('/logout', userController.logout);
app.get('/admin', passportConfig.isAuthenticated, adminController.adminHome);
app.get('/admin/upload', passportConfig.isAuthenticated, adminController.getAdminUpload);
app.post('/admin/upload', passportConfig.isAuthenticated, adminController.postAdminUpload);
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        failureFlash: true,
        failureRedirect: '/login-failed',
        successRedirect: '/'
    })
);
app.get('/contact', contactController.getContact);
app.post('/contact/send', contactController.postContact);
app.get('/api/instagram', function(req, res) {
    'use strict';

    req.pipe(instagramRequest).pipe(res);
});
app.get('/photos', photosController.photosHome);
app.get('/:page', contentController.getContent);

/**
 * error handler
 */
app.use(errorHandler({ dumpExceptions: true, showStack: true }));

/**
 * start
 */
app.listen(app.get('port'), function() {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});
