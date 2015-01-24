/**
 * GET /logout
 * log out
 */
exports.logout = function(req, res){
    req.logout();
    res.redirect("/");
};
