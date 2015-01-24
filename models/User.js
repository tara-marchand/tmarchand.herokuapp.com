var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    provider: String,
    uid: String,
    name: String,
    image: String,
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("User", userSchema);
