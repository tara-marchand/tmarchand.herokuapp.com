var contentController = require("./content");

/**
 * GET /logout
 * log out
 */
exports.logout = function(req, res){
    req.logout();
    res.redirect("/");
};

/**
 * GET /login-failed
 * show login failure screen
 */
exports.loginFailed = function(req, res){
    console.log(req.session.passport);
    req.params.page = "login-failed";
    contentController.getContent(req, res);
};
