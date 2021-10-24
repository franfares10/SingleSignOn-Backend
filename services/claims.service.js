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

const verifyRequestingUser = async function (user, tenant) {
  try {
    var credentialsObject = new CredentialService();
    console.log("02- Procedo a validar la información del usuario");
    const result = await credentialsObject.isValidCredentials(
      user.email,
      user.password,
      tenant
    );
    const resultIsAdmin = await getUser(user.email, tenant); //Si no funca borra esto
    if (!result || !resultIsAdmin.admin) {
      //Usuario está validado, le retorno el JWT correspondiente para que autorice.
      console.log("XX - USUARIO NO VALIDADO");
      return false;
    }
    const tenantInfoObject = new TenantService();
    const { jwt_secret } = await tenantInfoObject.getTenantSSOInfo();
    console.log("Secret con el que firmo" + jwt_secret);
    const jwtBody = {
      message: "The user has been validated",
      code: "OK - VALIDADO",
    };
    console.log("03- Usuario ha sido validado, retornando token");
    return jwt.sign(jwtBody, jwt_secret, { expiresIn: "1H" });
  } catch (e) {
    throw new Error("XX - Error returning JWT");
  }
};

const validateJwt = async function (jwtToken) {
  //Me podrían pasar el tenant para que yo tome la info de que hashear y listo.
  try {
    const jwt_secret = process.env.PUBLIC_SSH; //.replace(/\\n/gm, "\n");
    const jwtValidate = jwt.verify(
      jwtToken,
      jwt_secret,
      { algorithms: "RS256" }
    );
    var { email, tenant, claims } = jwt.decode(jwtToken); //admin
    if (!isValidTenant(tenant)) {
      throw new Error("XX - Tenant is not valid");
    }
    var isUserAdmin = false;
    claims.forEach((e) => {
      if (Object.keys(e)[0]=== "ADMIN" && Object.values(e)[0]===true) {
        isUserAdmin = true;
      }
    });
    if (!isUserAdmin) {
      throw new Error("XX - No fue validado");
    }
    return true;
    //Acá mi duda es, le mandamos algo estatico como para que nos hasheen siempre eso y ahí saber.
  } catch (e) {
    console.log("XX - Error validating JWT Token" + e);
    return false;
  }
};

const createNewClaim = async function (jwtPayload, jwtSecret, tenant, claim) {
  //O sea, el que tiene que crear un nuevo claim tiene que ser un admin, pero se tiene que autenticar primero.
  var saveUser = { tenant, claims: [claim], lastUpdate: Date.now() };
  try {
    if (!validateJwtAndPayload(jwtPayload)) {
      return false;
    }
    var oldVersion = await Claims.findOne({ tenant: tenant }); //,{$addToSet:[claim],lastUpdate: Date.now()},{new:true});
    var listaClaims = JSON.parse(JSON.stringify(oldVersion)).claims;
    if (listaClaims.includes(claim)) {
      console.log("XX - You cant add an existing claim");
      return false;
    }
    listaClaims.push(claim);
    if (oldVersion) {
      await Claims.updateOne(
        { tenant: tenant },
        { claims: listaClaims, lastUpdate: Date.now() },
        { new: true }
      );
      return true;
    }
    var dbObject = new Claims(saveUser);
    var result = await dbObject.save();
    return true;
  } catch (e) {
    throw new Error("Error performing operation" + e);
  }
};
const deleteExistingClaim = async function (tenant, claim) {
  try {
    const checkIsAdmin = await getUser(email, tenant);

    if (!checkIsAdmin.admin) {
      return false;
    }

    var oldVersion = await Claims.findOne({ tenant: tenant }); //,{$addToSet:[claim],lastUpdate: Date.now()},{new:true});
    var listaClaims = JSON.parse(JSON.stringify(oldVersion)).claims;
    var lista = new Set(listaClaims);
    if (!listaClaims.includes(claim)) {
      return false;
    }
    lista.delete(claim);
    if (oldVersion) {
      await Claims.updateOne(
        { tenant: tenant },
        { claims: lista.values, lastUpdate: Date.now() },
        { new: true }
      );
      return true;
    }
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
    if(!update){
      newClaims.push(claim);
    }
    await Users.updateOne(
      { email: user.email, tenant: user.tenant },
      { claims: newClaims },
      { new: true }
    );
    return true;
  } catch (e) {
    console.log(e)
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
  verifyRequestingUser,
  validateJwt,
  claimsForUser,
  deleteClaimsForUser,
};
