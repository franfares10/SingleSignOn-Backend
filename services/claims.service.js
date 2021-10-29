const Claims = require("../models/Claims.model");
const { getUser } = require("../services/user.service");
const bcrypt = require("bcryptjs");
const { SALT } = require("../constants/constants");
const Credentials = require("../models/Credentials.model");
const CredentialService = require("./credential.service");
const jwt = require("jsonwebtoken");
const Tenant = require("../models/Tenant.model");
const TenantService = require("./tenant.service");
const Users = require("../models/User.model");
const { VALID_TENANTS } = require("../constants/constants");
const fs = require("fs");

const validateJwt = async function (jwtToken) {
  //Me podrían pasar el tenant para que yo tome la info de que hashear y listo.
  try {
    const jwt_secret = process.env.PUBLIC_SSH;
    const jwtValidate = jwt.verify(jwtToken, jwt_secret, {
      algorithms: "RS256",
    });
    var { tenant, claims } = jwt.decode(jwtToken); //admin
    if (!isValidTenant(tenant)) {
      throw new Error("XX - Tenant is not valid");
    }
    var isUserAdmin = false;
    claims.forEach((e) => {
      if (Object.keys(e)[0] === "ADMIN" && Object.values(e)[0] === true) {
        isUserAdmin = true;
      }
    });
    if (!isUserAdmin) {
      throw new Error("XX - El usuario en cuestión no es admin");
    }
    return true;
    //Preguntarle al profe el tema de si le sacan un permiso una vez otorgado el token
  } catch (e) {
    console.log("XX - Error validating JWT Token" + e);
    return false;
  }
};

const createNewClaim = async function (tenant, claim) {
  //El parametro del jwtPayload, sería el token.
  var saveUser = { tenant, claims: [claim], lastUpdate: Date.now() };
  try {
    var oldVersion = await Claims.findOne({ tenant: tenant }); //,{$addToSet:[claim],lastUpdate: Date.now()},{new:true});
    if (!oldVersion) {
      console.log("XX - Creo nuevos claims");
      var dbObject = new Claims(saveUser);
      var result = await dbObject.save();
      return true;
    }
    var listaClaims = JSON.parse(JSON.stringify(oldVersion)).claims;
    if (listaClaims.includes(claim)) {
      console.log("XX - You cant add an existing claim");
      return false;
    }
    listaClaims.push(claim.toUpperCase());
    console.log("XX - Actualizó existentes");
    await Claims.updateOne(
      { tenant: tenant },
      { claims: listaClaims, lastUpdate: Date.now() },
      { new: true }
    );
    return true;
  } catch (e) {
    console.log("Rompio aca");
    return false;
  }
};
const deleteExistingClaim = async function (tenant, claim) {
  try {
    var oldVersion = await Claims.findOne({ tenant: tenant }); //,{$addToSet:[claim],lastUpdate: Date.now()},{new:true});
    if (!oldVersion) {
      return false;
    }
    var listaClaims = JSON.parse(JSON.stringify(oldVersion)).claims;
    var listaNueva = [];
    listaClaims.forEach((claimIncoming) => {
      if (claimIncoming === claim) {
        console.log("XX - Borro el claim");
      } else {
        listaNueva.push(claimIncoming);
      }
    });
    await Claims.updateOne(
      { tenant: tenant },
      { claims: listaNueva, lastUpdate: Date.now() },
      { new: true }
    );
    return true;
  } catch (e) {
    console.log(e);
    throw new Error("Error performing delete action on requested tenant");
  }
};

const claimsForUser = async (user, claim) => {
  const claimKey = Object.keys(claim)[0];
  try {
    //Obtengo el usuario, a el mismo le voy a actualizar los claims.
    const userObtained = await getUser(user.email, user.tenant);
    if (!userObtained) {
      console.log("XX - Usuario no encontrado");
      return false;
    }
    const newClaims = [];
    var update = false;
    userObtained.claims.forEach((claimObject) => {
      if (Object.keys(claimObject)[0] == claimKey) {
        newClaims.push(claim);
        update = true;
      } else {
        newClaims.push(claimObject);
      }
    });
    if (!update) {
      newClaims.push(claim);
    }
    await Users.updateOne(
      { email: user.email, tenant: user.tenant },
      { claims: newClaims },
      { new: true }
    );
    return true;
  } catch (e) {
    console.log(e);
    throw new Error("XX - Error creating claim for user" + user);
  }
};

const deleteClaimsForUser = async (user, claim) => {
  const claimKey = Object.keys(claim)[0];
  try {
    //Obtengo el usuario, a el mismo le voy a actualizar los claims.
    const userObtained = await getUser(user.email, user.tenant);
    const newClaims = [];
    userObtained.claims.forEach((claimObject) => {
      if (Object.keys(claimObject)[0] == claimKey) {
        console.log("XX - Claim eliminado");
      } else {
        newClaims.push(claimObject);
      }
    });
    await Users.updateOne(
      { email: user.email, tenant: user.tenant },
      { claims: newClaims },
      { new: true }
    );
    return true;
  } catch (e) {
    throw new Error("XX - Error creating claim for user" + user);
  }
};
const isValidTenant = (tenant) =>
  VALID_TENANTS.includes(tenant) ? true : false;

module.exports = {
  createNewClaim,
  deleteExistingClaim,
  validateJwt,
  claimsForUser,
  deleteClaimsForUser,
};
