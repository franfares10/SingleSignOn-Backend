var mongoose = require('mongoose');

var WebSchema = new mongoose.Schema({
    email: String,
    tenant: String,
    name: String,
    last_name: String,
    admin: Boolean
})

var Web = mongoose.model('web',WebSchema);

module.exports = Web;