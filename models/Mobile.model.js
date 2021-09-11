var mongoose = require('mongoose');

var MobileSchema = new mongoose.Schema({
    email: String,
    tenant: String,
    name: String,
    last_name: String,
    admin: Boolean
})

var Mobile = mongoose.model('Mobile',MobileSchema);

module.exports = Mobile;