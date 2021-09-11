const { response } = require("express");
const { validationResult } = require("express-validator");

const validarCampos = (req, res = response, next) => {
    const errorsOcurred = validationResult(req);
    if (!errorsOcurred.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errorsOcurred.array() 
        });
    } else {
        next();
    }
}

module.exports = {
    validarCampos
}