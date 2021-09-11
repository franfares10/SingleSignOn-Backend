var mongoose = require('mongoose');

var TenantSchema = new mongoose.Schema({
    name: String,
    jwt_secret: String
})

var Tenant = mongoose.model('tenant',TenantSchema);

module.exports = Tenant;