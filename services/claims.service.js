const Tenant = require("../models/Tenant.model");
const { getUser } = require("../services/user.service");
const jwt = require("jsonwebtoken");
const Users = require("../models/User.model");
const { VALID_TENANTS } = require("../constants/constants");

const validateJwt = async function (jwtToken) {
  //Me podrían pasar el tenant para que yo tome la info de que hashear y listo.
  const jwt_secret = process.env.PUBLIC_SSH;
  const jwtValidate = jwt.verify(jwtToken, jwt_secret, {
    algorithms: "RS256",
  });
  var { tenant, claims } = jwt.decode(jwtToken); //admin
  if (!isValidTenant(tenant)) {
    throw new Error("XX - Tenant is not valid");
  }
  var isUserAdmin = false;
  console.log(claims.length);
  if (claims.length == 0) {
    console.log("No tenía valores");
    throw new Error("XX - El usuario en cuestión no es admin");
  }
  claims.forEach((e) => {
    if (Object.keys(e)[0] === "ADMIN" && Object.values(e)[0] === true) {
      console.log("XX - Es admin!");
      isUserAdmin = true;
    }
  });
  if (!isUserAdmin) {
    throw new Error("XX - El usuario en cuestión no es admin");
  }
  return true;
};
const fecthAllClaims = async (tenant) => {
  const result = await Tenant.findOne({ name: tenant }).select("claims -_id");
  return result;
};
const createNewClaim = async function (tenant, claim) {
  //El parametro del jwtPayload, sería el token.
  var saveUser = { tenant, claims: [claim] };
  try {
    var oldVersion = await Tenant.findOne({ name: tenant }); //,{$addToSet:[claim],lastUpdate: Date.now()},{new:true});
    var listaClaims = JSON.parse(JSON.stringify(oldVersion)).claims;
    if (listaClaims.includes(claim)) {
      console.log("XX - You cant add an existing claim");
      return false;
    }
    listaClaims.push(claim.toUpperCase());
    console.log("XX - Actualizó existentes");
    await Tenant.updateOne(
      { name: tenant },
      { claims: listaClaims },
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
    var oldVersion = await Tenant.findOne({ name: tenant }); //,{$addToSet:[claim],lastUpdate: Date.now()},{new:true});
    var listaUsuarios = await Users.find({ tenant: tenant });
    console.log("Lista de usuarios: " + listaUsuarios);
    listaUsuarios.forEach(async (user) => {
      console.log("XX - User: " + user);
      var listaClaims = user.claims;
      var listaNueva = [];
      listaClaims.forEach((claimIncoming) => {
        console.log(Object.keys(claimIncoming)[0]);
        if (Object.keys(claimIncoming)[0] === claim.toUpperCase()) {
          console.log("XX - Borro el claim");
        } else {
          listaNueva.push(claimIncoming);
        }
      });
      try {
        var updateUser = await Users.updateOne(
          {
            email: user.email,
            tenant: tenant,
          },
          { claims: listaNueva }
        );
        listaNueva = [];
      } catch (e) {
        //tirarle algun error
      }
    });
    if (!oldVersion) {
      return false;
    }
    //forEach  de los users  de ese tenant para eliminar el claim en cuestión
    var listaClaims = JSON.parse(JSON.stringify(oldVersion)).claims;
    var listaNueva = [];
    listaClaims.forEach((claimIncoming) => {
      if (claimIncoming === claim) {
        console.log("XX - Borro el claim");
      } else {
        listaNueva.push(claimIncoming);
      }
    });
    await Tenant.updateOne(
      { name: tenant },
      { claims: listaNueva },
      { new: true }
    );
    return true;
  } catch (e) {
    console.log(e);
    throw new Error("Error performing delete action on requested tenant");
  }
};
const checkValidClaim = async (user, claimIncoming) => {
  try {
    var claimsExisting = await Tenant.findOne({ name: user.tenant });
    if (!claimsExisting) {
      return false;
    }
    var compararSet = new Set(claimsExisting.claims);
    if (compararSet.has(Object.keys(claimIncoming)[0].toUpperCase())) {
      console.log("XX - El claim existe");
      return true;
    }
    return false;
  } catch (e) {
    return false;
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
    const comparar = await checkValidClaim(user, claim);
    if (!comparar) {
      console.log("XX - Claim no existente");
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
  const claimKey = claim;
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
  fecthAllClaims,
};
