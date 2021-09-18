var mongoose = require('mongoose');
const { stringify } = require('querystring');

var TenantSchema = new mongoose.Schema({
    name: String,
    jwt_secret: String,
    redirectUrl: {
        type: String,
        required: false
    }
})

var Tenant = mongoose.model('tenant', TenantSchema, 'tenants');

module.exports = Tenant;