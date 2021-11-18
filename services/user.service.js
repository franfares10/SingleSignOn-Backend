var Credentials = require('../models/Credentials.model');
var Tenant = require('../models/Tenant.model');
const Users = require('../models/User.model');
var bcrypt = require('bcryptjs');
const { SALT } = require('../constants/constants');



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

        var isRegistered = await isUserRegistered(user.email, user.tenant);

        if (!isRegistered) { //if not registered --> we must create the user in both Collections (Credentials && Specified Tenant)

            //Creating a new Credentials instance
            var newCredentialsUser = new Credentials(credentials);
            // Saving the User in Credentials Collection
            await newCredentialsUser.save();
            
            //method to register the user in the correct tenant
            var savedUser = await registerUser(tenantUser);
            console.log("04- El usuario se guardó en el tenant correspondiente")
            return savedUser;

        }else{ //The user is registered in both Tenant and Credentials Collection
                throw Error("User already registered!");
            }

    } catch (e) {
        // return a Error message describing the reason 
        console.log(e)
        throw Error(e.message)
    }
}

const getUser = async function(email,tenant){
    let user = await Users.find({email,tenant});
    return user[0];
}


// FALTA CHECKEAR QUE EL JWT SEA DE UN USUARIO ADMIN

const deleteUser = async function (user) {

    try {
        var operation = false;
        var isRegistered = await isUserRegistered(user.email, user.tenant);

        if(isRegistered){
            await Credentials.deleteOne({ email: user.email, tenant: user.tenant });
            await Users.deleteOne({ email: user.email, tenant: user.tenant });
            operation = true;
        }
        return operation;

    } catch (e) {
        // return a Error message describing the reason 
        console.log(e)
        throw Error(e.message)
    }
}


const registerUser = async function (user) {
    try {
        var newUser = new Users(user);
        var savedUser = await newUser.save();
        return savedUser;
        
    } catch (e) {
        console.log("XX - Error guardando en el tenant al usuario")
        throw Error("Error while creating tenant user")
    }
}


const isUserRegistered = async function (email, tenant) {
    console.log("02- Busca las credenciales del usuario")
    var isRegistered = await Credentials.exists({
        email,
        tenant
    })
    return isRegistered;
}

const checkTenantInfo = async function (tenant) {
    console.log("04- Informacion del tenant de la base")
    var TenantInfo = await Tenant.find({
        name: tenant
    });
    return TenantInfo[0];

}


module.exports = {
    checkTenantInfo,
    getUser,
    createUser,
    deleteUser
}