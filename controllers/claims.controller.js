const ClaimService = require("../services/claims.service");
const { VALID_TENANTS } = require("../constants/constants");
const jwt = require("jsonwebtoken");

//Crea un nuevo claim dentro del tenant especifico que nos llega con el jwt.
const createNewUserClaim = async function (req, res) {
  const { jwtToken, claim } = req.body;
  try {
    const retornoValidate = await ClaimService.validateJwt(jwtToken);
    if (!retornoValidate) {
      return res.status(401).json({ message: "XX - The token was corrupted." });
    }
    const { tenant } = jwt.decode(jwtToken);
    var result = await ClaimService.createNewClaim(tenant, claim.toUpperCase());
    switch (result) {
      case true:
        return res.status(201).json({
          message: "The claim " + claim + " has been created",
        });
      case false:
        return res.status(400).json({
          message:
            "XX - The request could not be processed, you are probably trying to add an existing claim",
        });
    }

    /* 4248-7474
    4288-1796 / 
    5088-9110*/
  } catch (e) {
    return res.status(400).json({message:e.message});
  }
};

const deleteClaimFromTenant = async function (req, res) {
  const { jwtToken, claim } = req.body;
  console.log("XX - Hasta aca llego");
  const retornoValidate = await ClaimService.validateJwt(jwtToken);
  try {
    if (!retornoValidate) {
      return res.status(401).json({ message: "XX - The token was corrupted." });
    }
    const { tenant } = jwt.decode(jwtToken);
    var result = await ClaimService.deleteExistingClaim(
      tenant,
      claim.toUpperCase()
    );
    console.log(result);
    if (!result) {
      return res
        .status(401)
        .json({ message: "You must be an Admin to perform this operation" });
    }
    return res.status(204).send();
  } catch (e) {
    console.error("aca: " + e);
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
  console.log("XX - ACA");
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

const fetchAllClaims = async (req, res) => {
  try {
    //Fixear que solo traiga los del tenant en especifico
    const { tenant, jwtToken } = req.body;
    const validateReturn = await ClaimService.validateJwt(jwtToken);
    const tenantIncoming = await jwt.decode(jwtToken).tenant;
    if (!validateReturn) {
      return res.status(401).json({ message: "JWT TOKEN IS NOT VALID " });
    } else if (tenantIncoming != tenant) {
      return res.status(400).json({
        message: "XX - No podes ver otros claims que no sean de tu tenant",
      });
    }
    const result = await ClaimService.fecthAllClaims(tenant);
    return res.status(200).json(result);
  } catch (e) {
    res
      .status(400)
      .json({ message: "XX - You cant fetch all the claims in this moment" });
  }
};

module.exports = {
  createNewUserClaim,
  deleteClaimFromTenant,
  createTrazaClaimUser,
  isValidTenant,
  deleteTrazaClaimUser,
  fetchAllClaims,
};
