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

var setNavItems = function() {
    "use strict";
    var navItems = [];
    var stringsToExclude = ["home", "404", "markdown"];
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
app.post("/contact/send", routes.contact.send);
app.get("/:page", routes.page);

/* start */
app.listen(port);
console.log("server is running on port " + port);
