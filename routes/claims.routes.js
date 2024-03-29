const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  createNewUserClaim,
  deleteClaimFromTenant,
  createTrazaClaimUser,
  deleteTrazaClaimUser,
  fetchAllClaims,
} = require("../controllers/claims.controller");
const router = Router();
router.post(
  "/all",
  [check("tenant").not().isEmpty(), check("jwtToken").not().isEmpty()],
  fetchAllClaims
);
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
    check("jwtToken").not().isEmpty(),
  ],
  createNewUserClaim
);
router.delete(
  "/revoke",
  [check("claim").not().isEmpty(), 
  check("jwtToken").not().isEmpty()],
  deleteClaimFromTenant
);

module.exports = router;
