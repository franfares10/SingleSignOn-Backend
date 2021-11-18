const fs = require("fs");
const TenantService = require("../services/tenant.service");
const CredentialService = require("../services/credential.service");
const ClaimService = require("../services/claims.service");
const jwt = require("jsonwebtoken");
const UserService = require("../services/user.service");
const { VALID_TENANTS } = require("../constants/constants");
const Claims = require("../models/Claims.model");

const PRIVATE_KEY = process.env.PRIVATE_SECRET_SSH;
//Metodo para realizar el login desde el endpoint
const externalLogin = async function (req, res) {
  const { email, password, tenant } = req.body;
  try {
    const credentialService = new CredentialService();
    const isValidCredentials = await credentialService.isValidCredentials(
      email,
      password,
      tenant
    );
    if (isValidCredentials) {
      const tenantService = new TenantService(tenant);
      const tenantInfo = await tenantService.getTenantInfo();
      const { redirect } = tenantInfo;
      const user = await UserService.getUser(email, tenant);

      const token = jwt.sign(user.toJSON(), PRIVATE_KEY, {
        algorithm: "RS256",
        expiresIn: "1d",
      });
      return res.status(200).json({
        status: 200,
        token,
        message: "Token created successfully.",
        redirect,
      });
    } else {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error.",
    });
  }
};

const registerUser = async function (req, res) {
  const { email, password, tenant, name, last_name } = req.body;

  const User = {
    email,
    password,
    tenant,
    name,
    last_name
  };

  try {
    // Previously validate that it is a permitted tenant
    if (!isValidTenant(tenant)) {
      return res.status(406).json({ status: 406, message: "Invalid tenant." });
    }
    // Calling the Service function with the new object from the Request Body
    var createdUser = await UserService.createUser(User);
    return res
      .status(201)
      .json({ user: createdUser, message: "Succesfully Created User" });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    console.log(e);
    return res.status(400).json({ status: 400, message: e.message });
  }
};

const deleteUser = async function (req, res) {
  const { email, tenant, jwtToken } = req.body;
  if (!ClaimService.validateJwt(jwtToken)) {
    return res.status(401).json({message:"XX - The JWT Token is not valid."})
  }
  //add validat jwt
  const User = {
    email,
    tenant,
  };

  try {
    var isDelete = await UserService.deleteUser(User);
    if (isDelete) {
      return res.status(204).send();
    } else {
      return res.status(400).json({
        status: 400,
        user: User,
        message: "Unsuccessfully Deleted User",
      });
    }
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    console.log(e);
    return res.status(400).json({ status: 400, message: e.message });
  }
};

const isValidTenant = (tenant) =>
  VALID_TENANTS.includes(tenant) ? true : false;

module.exports = {
  externalLogin,
  registerUser,
  deleteUser,
};
