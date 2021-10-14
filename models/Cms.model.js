var mongoose = require('mongoose');

var CmsSchema = new mongoose.Schema({
    email: String,
    tenant: String,
    name: String,
    last_name: String,
    claims: [String]
})

var CMS = mongoose.model('cms', CmsSchema, 'cms');

module.exports = CMS;