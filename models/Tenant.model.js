var mongoose = require('mongoose');
const { stringify } = require('querystring');

var TenantSchema = new mongoose.Schema({
    name: String,
    jwt_secret: String,
    redirectUrl: {
        type: string,
        required: false
    }
})

var Tenant = mongoose.model('tenant',TenantSchema);

module.exports = Tenant;