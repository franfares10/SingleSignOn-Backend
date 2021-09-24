const Credentials = require('../models/Credentials.model');
var bcrypt = require('bcryptjs');

class CredentialService {
    constructor() {

    }

    async isValidCredentials(email, password) {
        const user = await Credentials.find({ email });
        var hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
        console.log(hashedPassword)
        if (user[0]) {
            if (hashedPassword === user[0].password) {
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