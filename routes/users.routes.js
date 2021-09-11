/*
    Endpoint: api/users
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const {External_login} = require('../controllers/users.controller')
const router = Router();

router.post('/login',
    [
        check('email').not().isEmpty(),
        check('password').not().isEmpty(),
        check('tenant').not().isEmpty(),
        validarCampos
    ],
   External_login
);

/*
router.post('/logininterno',
    [
        check('mail').not().isEmpty(),
        check('password').not().isEmpty(),
        validarCampos
    ],
    logininterno
);*/


module.exports = router;