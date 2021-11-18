var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    email: String,
    tenant: String,
    name: String,
    last_name: String,
    claims: [Object]
})

var Users = mongoose.model('users', UserSchema, 'users');

module.exports = Users;