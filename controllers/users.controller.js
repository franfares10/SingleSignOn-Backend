const TenantService = require('../services/tenant.service');
const CredentialService = require('../services/credential.service');
const jwt = require('jsonwebtoken');
const UserService = require('../services/user.service');

//Metodo para realizar el login desde el endpoint
const externalLogin = async function (req, res) {
    const { email, password, tenant } = req.body;
    try {
        const credentialService = new CredentialService();
        const isValidCredentials = await credentialService.isValidCredentials(email, password, tenant);
        if (isValidCredentials) {
            const tenantService = new TenantService(tenant);
            const tenantInfo = await tenantService.getTenantInfo();
            const { jwt_secret, redirect } = tenantInfo;
            const user = await tenantService.getUserFromTenant(email);
            const token = jwt.sign(user.toJSON(), jwt_secret, { expiresIn: '1d' });
            return res.status(200).json({
                status: 200,
                token,
                message: 'Token created successfully.',
                redirect
            });
        } else {
            return res.status(401).json({
                status: 401,
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

const registerUser = async function (req, res) {
    const {
        email,
        password,
        tenant,
        name,
        last_name,
        admin
    } = req.body;

    const User = {
        email,
        password,
        tenant,
        name,
        last_name,
        admin
    }

    try {
        // Calling the Service function with the new object from the Request Body
        var createdUser = await UserService.createUser(User)
        return res.status(201).json({ user: createdUser, message: "Succesfully Created User" })
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        console.log(e)
        return res.status(400).json({ status: 400, message: e.message })
    }
}

module.exports = {
    externalLogin,
    registerUser
}


