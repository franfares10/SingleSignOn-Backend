/*
    Endpoint: api/users
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const {login} = require('../controllers/users.controller')
const router = Router();

router.get('/getClienteById/:id',
    login
);

router.post('/solicitar',
    [
        check('name').not().isEmpty(),
        check('idPersona').not().isEmpty(),
        check('password').not().isEmpty(),
        check('mail').not().isEmpty(),
        validarCampos
    ],
   login
);

router.post('/login',
    [
        check('mail').not().isEmpty(),
        check('password').not().isEmpty(),
        validarCampos
    ],
    login
);

router.put('/aprobar/:id',
    login
);

router.put('/contrasenia',
    [
        check('mail').not().isEmpty(),
        check('password').not().isEmpty(),
    ],
    login
);

module.exports = router;