var Tenant = require('../models/Tenant.model');

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