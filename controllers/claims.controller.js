const ClaimService = require("../services/claims.service");
const { VALID_TENANTS } = require("../constants/constants");

const requestJWTClaims = async function (req, res) {
  console.log("01- Entrando a pedir JWT para claims");
  const { tenant, user } = req.body;
  const result = await ClaimService.verifyRequestingUser(user, tenant);
  if (!result) {
    return res
      .status(401)
      .send({ token: "Usuario con credenciales incorrectas" });
  }
  return res.status(200).send({ token: result });
};

const validJwtValidation = async function (req, res) {
  const { jwtPayload, jwtToken } = req.body;
  const result = await ClaimService.validateJwtAndPayload(jwtPayload, jwtToken);
  if (result) {
    return res.status(204).send();
  }
  return res.status(401).json({ message: "XX - TOKEN HA SIDO MODIFICADO" });
  //Le paso un secret, entonces con ese secret me consumen a mi con cierto payload. Además, me tienen que pasar el JWT  y verificar si son ellos.
};

const createNewUserClaim = async function (req, res) {
  const { tenant, jwtPayload, jwtToken, claim } = req.body;
  try {
    if (!isValidTenant(tenant)) {
      return res.status(406).json({ status: 406, message: "Invalid tenant." });
    }
    var result = await ClaimService.createNewClaim(
      jwtPayload,
      jwtToken,
      tenant,
      claim.toUpperCase()
    );
    if (!result) {
      return res
        .status(401)
        .json({ message: "You must be an Admin to perform this operation" });
    }
    return res.status(201).json({
      message: "The claim " + claim + " has been created",
    });
  } catch (e) {
    console.error(e);
    return res.status(400).send("You cant perform this operation right now");
  }
};

const deleteClaimFromTenant = async function (req,res) {
  const { tenant, jwtPayload,jwtToken, claim } = req.body;
  var jwtSecret = jwtToken;
  try {
    if (!isValidTenant(tenant)) {
      return res.status(406).json({ status: 406, message: "Invalid tenant." });
    }
    var result = await ClaimService.deleteExistingClaim(
      tenant,
      claim.toUpperCase(),
      jwtPayload,
      jwtSecret
    );
    if (!result) {
      return res
        .status(401)
        .json({ message: "You must be an Admin to perform this operation" });
    }
    return res.status(204).send();
  } catch (e) {
    console.error(e);
    return res.status(400).send("You cant perform this operation right now");
  }
};

const isValidTenant = (tenant) =>
  VALID_TENANTS.includes(tenant) ? true : false;

module.exports = {
  createNewUserClaim,
  deleteClaimFromTenant,
  requestJWTClaims,
  validJwtValidation,
};
