var mongoose = require('mongoose');
const { stringify } = require('querystring');

var TenantSchema = new mongoose.Schema({
    name: String,
    redirect: {
        type: String,
        required: false
    },
    claims:[String]
})

var Tenant = mongoose.model('tenant', TenantSchema, 'tenants');

module.exports = Tenant;