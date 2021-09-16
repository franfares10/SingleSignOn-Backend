const Credentials = require('../models/Credentials.model');

class CredentialService {
    constructor() {

    }

    async isValidCredentials(email, password) {
        const user = await Credentials.find({ email });
        if (user[0]) {
            if (password === user[0].password) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}

module.exports = CredentialService;