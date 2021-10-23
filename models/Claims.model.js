var mongoose = require('mongoose')

var ClaimsSchema = new mongoose.Schema({
    tenant: String,
    claims: [String],
    lastUpdate: Date
})

var Claims = mongoose.model('claims',ClaimsSchema,'claims')

module.exports = Claims;