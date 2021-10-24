const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  createNewUserClaim,
  deleteClaimFromTenant,
  requestJWTClaims,
  validJwtValidation,
  createTrazaClaimUser,
  deleteTrazaClaimUser,
} = require("../controllers/claims.controller");
const { deleteClaimsForUser } = require("../services/claims.service");
const router = Router();
router.delete(
  "/claim",
  [
    check("user").not().isEmpty(),
    check("claim").not().isEmpty(),
    check("jwtToken").not().isEmpty(),
  ],
  deleteTrazaClaimUser
);
router.post(
  "/claim",
  [
    check("user").not().isEmpty(),
    check("claim").not().isEmpty(),
    check("jwtToken").not().isEmpty(),
  ],
  createTrazaClaimUser
);
router.post(
  "/initialize",
  [
    check("tenant").not().isEmpty(),
    check("claim").not().isEmpty(),
    check("jwtPayload").not().isEmpty(),
    check("jwtToken").not().isEmpty(),
  ],
  createNewUserClaim
);
router.post(
  "/request",
  [check("tenant").not().isEmpty(), check("user").not().isEmpty()],
  requestJWTClaims
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
