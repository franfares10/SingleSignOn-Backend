var mongoose = require('mongoose');

var CmsSchema = new mongoose.Schema({
    email: String,
    tenant: String,
    name: String,
    last_name: String,
    admin: Boolean
})

var CMS = mongoose.model('CMS',CmsSchema);

module.exports = CMS;