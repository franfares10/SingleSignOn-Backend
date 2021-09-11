var mongoose = require('mongoose');

var FacturacionSchema = new mongoose.Schema({
    email: String,
    tenant: String,
    name: String,
    last_name: String,
    admin: Boolean
})

var Facturacion = mongoose.model('Facturacion',FacturacionSchema);

module.exports = Facturacion;