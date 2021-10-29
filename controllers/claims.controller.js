const ClaimService = require("../services/claims.service");
const { VALID_TENANTS } = require("../constants/constants");
const jwt = require("jsonwebtoken");

const createNewUserClaim = async function (req, res) {
  const { jwtToken, claim } = req.body;
  try {
    if (!ClaimService.validateJwt(jwtToken)) {
      return res.status(401).json({ message: "XX - The token was corrupted." });
    }
    const { tenant } = jwt.decode(jwtToken);
    var result = await ClaimService.createNewClaim(tenant, claim.toUpperCase());
    if (!result) {
      return res.status(400).json({
        message:
          "XX - The request could not be processed, you are probably trying to add an existing claim",
      });
    }
    return res.status(201).json({
      message: "The claim " + claim + " has been created",
    });
  } catch (e) {
    console.error(e);
    return res.status(400).send("You cant perform this operation right now");
  }
};

const deleteClaimFromTenant = async function (req, res) {
  const { jwtToken, claim } = req.body;
  try {
    if (!ClaimService.validateJwt(jwtToken)) {
      return res.status(401).json({ message: "XX - The token was corrupted." });
    }
    const { tenant } = jwt.decode(jwtToken);
    var result = await ClaimService.deleteExistingClaim(
      tenant,
      claim.toUpperCase()
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

const createTrazaClaimUser = async function (req, res) {
  //Crea un claim en el objeto del usuario, con su respectivo valor.
  const { claim, jwtToken, user } = req.body;
  const retornoValidate = await ClaimService.validateJwt(jwtToken);
  if (!retornoValidate) {
    return res
      .status(401)
      .json({ message: "JWT Token was corrupted, try again later." });
  }

  const result = await ClaimService.claimsForUser(user, claim);

  if (!result) {
    return res
      .status(400)
      .json({ message: "You cant perform this update right now." });
  }
  return res.status(204).send();
};
const deleteTrazaClaimUser = async function (req, res) {
  const { claim, jwtToken, user } = req.body;
  const retornoValidate = await ClaimService.validateJwt(jwtToken);
  if (!retornoValidate) {
    return res
      .status(401)
      .json({ message: "JWT Token was corrupted, try again later." });
  }

  const result = await ClaimService.deleteClaimsForUser(user, claim);

  if (!result) {
    return res
      .status(400)
      .json({ message: "You cant perform this delete right now." });
  }
  return res.status(204).send();
};
const isValidTenant = (tenant) =>
  VALID_TENANTS.includes(tenant) ? true : false;

module.exports = {
  createNewUserClaim,
  deleteClaimFromTenant,
  createTrazaClaimUser,
  isValidTenant,
  deleteTrazaClaimUser,
};
