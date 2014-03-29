var express = require('express');
var exphbs = require('express3-handlebars');
var app = express();
var port = Number(process.env.PORT || 5000);
var sendgrid  = require('sendgrid')(
  process.env.SENDGRID_USERNAME,
  process.env.SENDGRID_PASSWORD
);

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

/* routes */
app.get('/', function (req, res) {
    res.render('home');
});

app.get('/resume', function (req, res) {
    res.render('resume');
});

app.get('/contact', function (req, res) {
    res.render('contact');
});

app.get('/contact/send', function (req, res) {
    
});

/* start */
app.listen(port);
console.log('server is running on port ' + port);
