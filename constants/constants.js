const Claims = require("../models/Claims.model");

const SALT = "$2a$10$WCrOpAZGooFXc1ELav45au";
const CMS_KEY = "cms";
const FACTURACION_KEY = "facturacion";
const MOBILE_KEY = "mobile";
const SUSCRIPCIONES_KEY = "suscripciones";
const WEB_KEY = "web";
const VALID_TENANTS = [
  CMS_KEY,
  MOBILE_KEY,
  FACTURACION_KEY,
  SUSCRIPCIONES_KEY,
  WEB_KEY,
];

const getValidClaims = async function (tenantId) {
    try{
        var claims = Claims.find({tenant:tenantId})
        return claims[0].claims;
    }catch(e){
        throw new Error("Error getting valid claims with tenant"+tenant);
    }
};

module.exports = {
  SALT,
  CMS_KEY,
  FACTURACION_KEY,
  MOBILE_KEY,
  SUSCRIPCIONES_KEY,
  WEB_KEY,
  VALID_TENANTS,
};
