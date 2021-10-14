const Claims = require("../models/Claims.model");
const { getUser } = require("../services/user.service");
const bcrypt = require("bcryptjs");
const { SALT } = require("../constants/constants");
const Credentials = require("../models/Credentials.model");
const CredentialService = require("./credential.service");
const jwt = require("jsonwebtoken");
const Tenant = require("../models/Tenant.model");
const TenantService = require("./tenant.service");

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
    const listaClaims = JSON.parse(JSON.stringify(resultIsAdmin));
    if (!result || !listaClaims.claims.includes("ADMIN")) {
      //Usuario está validado, le retorno el JWT correspondiente para que autorice.
      console.log("XX - USUARIO NO VALIDADO");
      return false;
    }
    const tenantInfoObject = new TenantService();
    const { jwt_secret } = await tenantInfoObject.getTenantSSOInfo();
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

const validateJwtAndPayload = async function (jwtPayload, jwtToken) {
  //Me podrían pasar el tenant para que yo tome la info de que hashear y listo.
  try {
    const tenantInfoObject = new TenantService();
    const { jwt_secret } = await tenantInfoObject.getTenantSSOInfo();
    const jwtValidate = jwt.verify(jwtToken, jwt_secret);
    if (!jwtValidate) {
      return new Error("XX - JWT TOKEN WAS CORRUPTED");
    }
    //Necesito ver si son ellos, pasando mi ssh privada a ellos y que me respondan con cierto payload.,
    const validationJwtPayload = bcrypt.hashSync(
      "COSA PARA HASHEAR TITAN",
      SALT
    );
    if (validationJwtPayload === jwtPayload) {
      console.log("VALIDACION HECHA");
      return true;
    } else {
      console.log("FALLO LA VALIDACIÓN");
      return false;
    }
    //Acá mi duda es, le mandamos algo estatico como para que nos hasheen siempre eso y ahí saber.
  } catch (e) {
    console.log(e);
    throw new Error("XX - Error validating existing jwtToken and jwtPayload");
  }
};

const createNewClaim = async function (
  jwtPayload,
  jwtSecret,
  tenant,
  claimParam
) {
  //O sea, el que tiene que crear un nuevo claim tiene que ser un admin, pero se tiene que autenticar primero.
  var claim = claimParam.toUpperCase();
  var saveUser = { tenant, claims: [claim], lastUpdate: Date.now() };
  try {
    if (!validateJwtAndPayload(jwtPayload, jwtSecret)) {
      return false;
    }
    var oldVersion = await Claims.findOne({ tenant: tenant }); //,{$addToSet:[claim],lastUpdate: Date.now()},{new:true});
    if (!oldVersion) {
      var dbObject = new Claims(saveUser);
      var result = await dbObject.save();
      return true;
    }
    var listaClaims = JSON.parse(JSON.stringify(oldVersion)).claims;
    if (listaClaims.includes(claim)) {
      console.log("XX - You cant add an existing claim");
      return false;
    }
    listaClaims.push(claim);
    await Claims.updateOne(
      { tenant: tenant },
      { claims: listaClaims, lastUpdate: Date.now() },
      { new: true }
    );
    return true;
  } catch (e) {
    throw new Error("Error performing operation" + e);
  }
};
const deleteExistingClaim = async function (
  tenant,
  claim,
  jwtPayload,
  jwtSecret
) {
  try {
    if (!validateJwtAndPayload(jwtPayload, jwtSecret)) {
      console.log("Falló la validacion");
      return false;
    }
    var oldVersion = await Claims.findOne({ tenant: tenant }); //,{$addToSet:[claim],lastUpdate: Date.now()},{new:true});
    var listaClaims = JSON.parse(JSON.stringify(oldVersion)).claims;
    var lista = new Set(listaClaims);
    if (!listaClaims.includes(claim)) {
      console.log("XX - No se puede borrar un claim no existente");
      return false;
    }
    lista.delete(claim);
    var listaNuevaClaims = [];
    lista.forEach((e) => listaNuevaClaims.push(e));
    if (oldVersion) {
      await Claims.updateOne(
        { tenant: tenant },
        { claims: listaNuevaClaims, lastUpdate: Date.now() },
        { new: true }
      );
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
    throw new Error("Error performing delete action on requested tenant");
  }
};

module.exports = {
  createNewClaim,
  deleteExistingClaim,
  verifyRequestingUser,
  validateJwtAndPayload,
};
