var mongoose = require('mongoose');

var CredentialSchema = new mongoose.Schema({
    email:String,
    password:String,
    tenant: String
})

const Credentials = mongoose.model('credentials',CredentialSchema, 'credentials');

module.exports = Credentials;