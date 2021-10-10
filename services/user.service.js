var Credentials = require('../models/Credentials.model');
var Tenant = require('../models/Tenant.model');
var CMS = require('../models/Cms.model');
var Facturacion = require('../models/Facturacion.model');
var Mobile = require('../models/Mobile.model');
var Suscripciones = require('../models/Suscripciones.model');
var Web = require('../models/Web.model');
var bcrypt = require('bcryptjs');
const { SALT,  CMS_KEY,FACTURACION_KEY,MOBILE_KEY,SUSCRIPCIONES_KEY,WEB_KEY} = require('../constants/constants');


const createUser = async function (user) {
    // Creating a new Mongoose Object by using the new keyword
    const credentials = {
        email: user.email,
        password: bcrypt.hashSync(user.password, SALT),
        tenant: user.tenant
    }

    const tenantUser = {
        email: user.email,
        tenant: user.tenant,
        name: user.name,
        last_name: user.last_name,
        admin: user.admin
    }

    try {

        var isUserRegistered = await checkEmail(user.email, user.tenant);
        var isUserRegisteredInTenant = await checkEmailTenant(user.email, user.tenant);

        if (!isUserRegistered) { //if not registered --> we must create the user in both Collections (Credentials && Specified Tenant)

            //Creating a new Credentials instance
            var newCredentialsUser = new Credentials(credentials);
            // Saving the User in Credentials Collection
            var savedUserInCredentials = await newCredentialsUser.save();
            
            //method to register the user in the correct tenant
            var savedUserInTenant = await registerUserInTenant(tenantUser);
            console.log("04- El usuario se guardó en el tenant correspondiente")
            return savedUserInTenant;
        } else {
            if (!isUserRegisteredInTenant) { //if registered in credentials && not registered in the specified tenant --> we must create the user in the Tenant Collection

                var savedUserInTenant = await registerUserInTenant(tenantUser);
                console.log("04- El usuario se guardó en el tenant correspondiente")
                return savedUserInTenant;

            } else { //The user is registered in both Tenant and Credentials Collection
                throw Error("User already registered!");
            }
        }


    } catch (e) {
        // return a Error message describing the reason 
        console.log(e)
        throw Error(e.message)
    }
}
const deleteUser = async function (user) {

    try {
        var operation = false;
        var isUserRegistered = await checkEmail(user.email, user.tenant);
        var isUserRegisteredInTenant = await checkEmailTenant(user.email, user.tenant);
        if(isUserRegistered && isUserRegisteredInTenant){
            var response = await Credentials.deleteOne({ email: user.email, tenant: user.tenant });
            if (user.tenant === "cms"){
                await CMS.deleteOne({ email: user.email });
            }if (user.tenant === "facturacion"){
                await Facturacion.deleteOne({ email: user.email });
            }if (user.tenant === "mobile"){
                await Mobile.deleteOne({ email: user.email });
            }if (user.tenant === "web"){
                await Web.deleteOne({ email: user.email });
            }if (user.tenant === "suscripciones"){
                await Suscripciones.deleteOne({ email: user.email });
            }
            operation = true;
        }
        return operation;

    } catch (e) {
        // return a Error message describing the reason 
        console.log(e)
        throw Error(e.message)
    }
}


const registerUserInTenant = async function (user) {
    try {
        var tenant = user.tenant;
        switch (tenant) {
            case CMS_KEY:
                var newUser = new CMS(user);
                var savedUser = await newUser.save();
                return savedUser;
            case FACTURACION_KEY:
                var newUser = new Facturacion(user);
                var savedUser = await newUser.save();
                return savedUser;
            case MOBILE_KEY:
                var newUser = new Mobile(user);
                var savedUser = await newUser.save();
                return savedUser;
            case SUSCRIPCIONES_KEY:
                var newUser = new Suscripciones(user);
                var savedUser = await newUser.save();
                return savedUser;
            case WEB_KEY:
                var newUser = new Web(user);
                var savedUser = await newUser.save();
                return savedUser;
        }
    } catch (e) {
        console.log("XX - Error guardando en el tenant al usuario")
        throw Error("Error while creating tenant user")
    }
}


const checkEmail = async function (email, tenant) {
    console.log("02- Busca las credenciales del usuario")
    var isEmailRegistered = await Credentials.exists({
        email,
        tenant
    })
    return isEmailRegistered;
}

const checkTenantInfo = async function (tenant) {
    console.log("04- Informacion del tenant de la base")
    var TenantInfo = await Tenant.find({
        name: tenant
    });
    return TenantInfo[0];

}


const checkEmailTenant = async function (email, tenant) {
    console.log('03- Yendo a buscar la información al Tenant')
    switch (tenant) {
        case CMS_KEY:
            var isUserRegistered = await CMS.exists({
                email
            });
            return isUserRegistered;
        case FACTURACION_KEY:
            var isUserRegistered = await Facturacion.exists({
                email
            });
            return isUserRegistered;
        case MOBILE_KEY:
            var isUserRegistered = await Mobile.exists({
                email
            });
            return isUserRegistered;
        case SUSCRIPCIONES_KEY:
            var isUserRegistered = await Suscripciones.exists({
                email
            });
            return isUserRegistered;
        case WEB_KEY:
            var isUserRegistered = await Web.exists({
                email
            });
            return isUserRegistered;
    }
}

const getUser = async function (email, tenant) {
    console.log("05- Buscando informacion correspondiente al user y tenant")
    switch (tenant) {
        case CMS_KEY:
            var user = await CMS.find({
                email
            });
            return user[0];
        case FACTURACION_KEY:
            var user = await Facturacion.find({
                email
            });
            return user[0];
        case MOBILE_KEY:
            var user = await Mobile.find({
                email
            });
            return user[0];
        case SUSCRIPCIONES_KEY:
            var user = await Suscripciones.find({
                email
            });
            return user[0];
        case WEB_KEY:
            var user = await Web.find({
                email
            });
            return user[0];
    }
}

module.exports = {
    checkTenantInfo,
    getUser,
    createUser,
    deleteUser
}
