var express = require('express');
var exphbs = require('express3-handlebars');
var app = express();

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.listen(5000);
console.log('server is running');
