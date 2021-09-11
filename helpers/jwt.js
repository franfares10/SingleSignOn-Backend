const jwt = require('jsonwebtoken');

const generateJWT = (id, email) => {
    return new Promise(( resolve, reject) => {
        const payload = {
            id: id,
            email: email
        }
        jwt.sign(payload, process.env.JWT_SECRET, {
            // expiresIn: '24h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('Error generating JWT');
            } else {
                resolve(token);
            }
        });
    });
}

module.exports = {
    generateJWT,
}