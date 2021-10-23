/*
    Endpoint: api/users
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  externalLogin,
  registerUser,
  deleteUser,
  createNewUserClaim,
  deleteClaimFromTenant,
} = require("../controllers/users.controller");
const { deleteExistingClaim } = require("../services/user.service");
const router = Router();

router.post(
  "/login",
  [
    check("email").not().isEmpty(),
    check("password").not().isEmpty(),
    check("tenant").not().isEmpty(),
    validarCampos,
  ],
  externalLogin
);

router.post(
  "/register",
  [
    check("email").not().isEmpty(),
    check("password").not().isEmpty(),
    check("tenant").not().isEmpty(),
    check("name").not().isEmpty(),
    check("last_name").not().isEmpty(),
    check("admin").not().isEmpty(),
    validarCampos,
  ],
  registerUser
);
router.post(
  "/delete",
  [
    check("email").not().isEmpty(),
    check("tenant").not().isEmpty(),
    validarCampos,
  ],
  deleteUser
);
module.exports = router;
