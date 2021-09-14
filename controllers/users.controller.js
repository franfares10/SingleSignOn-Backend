const TenantService = require('../services/tenant.service');
const CredentialService = require('../services/credential.service');
const jwt = require('jsonwebtoken');


//Metodo para realizar el login desde el endpoint
const externalLogin = async function (req, res) {
    const { email, password, tenant } = req.body;
    try {
        const credentialService = new CredentialService();
        const isValidCredentials = await credentialService.isValidCredentials(email, password);
        if (isValidCredentials) {
            const tenantService = new TenantService(tenant);
            const tenantInfo = await tenantService.getTenantInfo();
            const { jwt_secret } = tenantInfo;
            const user = await tenantService.getUserFromTenant(email);
            const token = jwt.sign(user.toJSON(), jwt_secret, { expiresIn: '1d' });
            return res.status(200).json({
                status: 200,
                token,
                message: 'Token created successfully.'
            });
        } else {
            return res.status(401).json({
                status: 404,
                message: 'Unauthorized.'
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error.'
        });
    }
}

module.exports = {
    externalLogin
}