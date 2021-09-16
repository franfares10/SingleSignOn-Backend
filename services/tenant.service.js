var Tenant = require('../models/Tenant.model');
var CMS = require('../models/Cms.model');
var Facturacion = require('../models/Facturacion.model');
var Mobile = require('../models/Mobile.model');
var Suscripciones = require('../models/Suscripciones.model');
var Web = require('../models/Web.model');

class TenantService {
	constructor(tenantName) {
		this._tenantName = tenantName;
	}

	async getUserFromTenant(email) {
		let mongooseModel;
		if (this._tenantName === 'cms') {
			mongooseModel = CMS;
		}
		if (this._tenantName === 'facturacion') {
			mongooseModel = Facturacion;
		}
		if (this._tenantName === 'mobile') {
			mongooseModel = Mobile;
		}
		if (this._tenantName === 'suscripciones') {
			mongooseModel = Suscripciones;
		}
		if (this._tenantName === 'web') {
			mongooseModel = Web;
		}
		const user = await mongooseModel.find({ email });
		return user[0]
	}

	async getTenantInfo() {
		const info = await Tenant.find({ name: this._tenantName });
		return info[0]
	}
}

module.exports = TenantService;