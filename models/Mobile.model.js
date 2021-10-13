var mongoose = require('mongoose');

var MobileSchema = new mongoose.Schema({
    email: String,
    tenant: String,
    name: String,
    last_name: String,
    admin: Boolean,
    claims: [String]
})

var Mobile = mongoose.model('mobile', MobileSchema, 'mobile');

module.exports = Mobile;