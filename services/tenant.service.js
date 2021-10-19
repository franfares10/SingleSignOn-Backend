var Tenant = require('../models/Tenant.model');
var CMS = require('../models/Cms.model');
var Facturacion = require('../models/Facturacion.model');
var Mobile = require('../models/Mobile.model');
var Suscripciones = require('../models/Suscripciones.model');
var Web = require('../models/Web.model');
const { CMS_KEY, FACTURACION_KEY, MOBILE_KEY, SUSCRIPCIONES_KEY, WEB_KEY } = require('../constants/constants');

class TenantService {
	constructor(tenantName) {
		this._tenantName = tenantName;
	}

	async getTenantInfo() {
		const info = await Tenant.find({ name: this._tenantName });
		return info[0]
	}
}

module.exports = TenantService;