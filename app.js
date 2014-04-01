/* require */
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

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");
app.locals.viewsdir = path.join(__dirname, "views");

app.use(express.static(__dirname + "/public"));
app.use("/bower_components",  express.static(__dirname + "/bower_components"));
app.use(express.bodyParser());
app.use(express.logger("dev"));
app.use(app.router);

var getViewNamesInPath = function(path) {
    "use strict";
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
    "use strict";
    var navItems = getViewNamesInPath(__dirname + "/views");
    for (var i = navItems.length - 1; i >= 0; i--) {
        if (navItems[i] === "home") {
            navItems.splice(i, 1);
        }
    }
    app.set("navItems", navItems);
};

setNavItems();

/* routes */
app.get("/", routes.index);
app.get("/md", routes.md);
app.post("/contact/send", routes.contact.send);
app.get("/:page", routes.page);

/* start */
app.listen(port);
console.log("server is running on port " + port);
