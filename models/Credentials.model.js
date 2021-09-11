var mongoose = require('mongoose');

var CredentialSchema = new mongoose.Schema({
    email:String,
    password:String
})

const Credentials = mongoose.model('credentials',CredentialSchema);

module.exports = Credentials;