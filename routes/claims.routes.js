const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  createNewUserClaim,
  deleteClaimFromTenant,
  requestJWTClaims,
  validJwtValidation,
} = require("../controllers/claims.controller");
const router = Router();
router.post(
  "/initialize",
  [check("tenant").not().isEmpty(), check("claim").not().isEmpty(),check("jwtPayload").not().isEmpty(),check("jwtToken").not().isEmpty()],
  createNewUserClaim
);
router.post(
  "/request",
  [check("tenant").not().isEmpty(), check("user").not().isEmpty()],
  requestJWTClaims
);
router.post(
  "/verify",
  [check("jwtPayload").not().isEmpty(), check("jwtToken").not().isEmpty()],
  validJwtValidation
);
router.delete(
  "/revoke",
  [
    check("email").not().isEmpty(),
    check("tenant").not().isEmpty(),
    check("user").not().isEmpty(),
  ],
  deleteClaimFromTenant
);

module.exports = router;
