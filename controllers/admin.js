/**
 * GET /admin
 * admin page
 */
exports.adminHome = function(req, res) {
    res.render("admin/index");
};

/**
 * GET /admin/uploads
 * uploads page
 */
exports.getAdminUpload = function(req, res) {
    res.render("admin/upload");
};

/**
 * POST /admin/uploads
 * upload the file
 */
exports.postAdminUpload = function(req, res) {
    console.dir(req.files);
};
