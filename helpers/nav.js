module.exports = exports = {};

var path = require("path");
var fs = require("fs");

var navItems = ["contact", "resume"];

var getViewNames = function() {
    var viewsPath = path.resolve("views");
    var files = fs.readdirSync(viewsPath);

    var viewNames = [];
    var file;
    var fileNoExt;
    var filePath;
    var fileStats;
    for (var i in files) {
        file = files[i];
        fileNoExt = file.replace(".handlebars", "").replace(".markdown", "");
        filePath = viewsPath + "/" + file;
        fileStats = fs.statSync(filePath);
        if (fileStats.isFile() && stringsToExclude.indexOf(fileNoExt) === -1 && fileNoExt[0] !== ".") {
            viewNames.push(fileNoExt);
        }
    }
};

exports.getItems = function() {
    return navItems;
};
