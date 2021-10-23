var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    email: String,
    tenant: String,
    name: String,
    last_name: String,
    admin: Boolean,
    claims: [String]
})

var Users = mongoose.model('users', UserSchema, 'users');

module.exports = Users;