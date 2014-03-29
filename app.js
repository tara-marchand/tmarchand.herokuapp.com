var express = require('express');
var exphbs = require('express3-handlebars');
var app = express();
var port = Number(process.env.PORT || 5000);

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/resume', function (req, res) {
    res.render('resume');
});

app.listen(port);
console.log('server is running on port ' + port);
