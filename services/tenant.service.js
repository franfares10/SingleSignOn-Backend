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

	async getUserFromTenant(email) {
		let mongooseModel;
		switch(this._tenantName){
			case CMS_KEY:
				mongooseModel = CMS;
			case FACTURACION_KEY:
				mongooseModel = Facturacion;
			case MOBILE_KEY:
				mongooseModel = Mobile;
			case SUSCRIPCIONES_KEY:
				mongooseModel = Suscripciones;
			case WEB_KEY:
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