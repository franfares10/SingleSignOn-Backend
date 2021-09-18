var Credentials = require('../models/Credentials.model');
var Tenant = require('../models/Tenant.model');
var CMS = require('../models/Cms.model');
var Facturacion = require('../models/Facturacion.model');
var Mobile = require('../models/Mobile.model');
var Suscripciones = require('../models/Suscripciones.model');
var Web = require('../models/Web.model');
var bcrypt = require('bcryptjs');
const { SALT } = require('../constants/constants');


const createUser = async function (user) {
    // Creating a new Mongoose Object by using the new keyword
    const credentials = {
        email: user.email,
        password: bcrypt.hashSync(user.password, SALT)
    }

    const tenantUser = {
        email: user.email,
        tenant: user.tenant,
        name: user.name,
        last_name: user.last_name,
        admin: user.admin
    }

    try {

        var isUserRegistered = await checkEmail(user.email);
        var isUserRegisteredInTenant = await checkEmailTenant(user.email, user.tenant);

        if (!isUserRegistered) { //if not registered --> we must create the user in both Collections (Credentials && Specified Tenant)

            //Creating a new Credentials instance
            var newCredentialsUser = new Credentials(credentials);
            // Saving the User in Credentials Collection
            var savedUserInCredentials = await newCredentialsUser.save();

            //method to register the user in the correct tenant
            var savedUserInTenant = await registerUserInTenant(tenantUser);

            return savedUserInTenant;
        } else {
            if (!isUserRegisteredInTenant) { //if registered in credentials && not registered in the specified tenant --> we must create the user in the Tenant Collection

                var savedUserInTenant = await registerUserInTenant(tenantUser);
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



//I´ve made this method apart from 'createUser' but check if it´s OK or refactor it.
const registerUserInTenant = async function (user) {
    try {
        switch (user.tenant) {
            case 'cms':
                var newUser = new CMS(user);
                var savedUser = await newUser.save();
                return savedUser;
            case 'facturacion':
                var newUser = new Facturacion(user);
                var savedUser = await newUser.save();
                return savedUser;
            case 'mobile':
                var newUser = new Mobile(user);
                var savedUser = await newUser.save();
                return savedUser;
            case 'suscripciones':
                var newUser = new Suscripciones(user);
                var savedUser = await newUser.save();
                return savedUser;
            case 'web':
                var newUser = new Web(user);
                var savedUser = await newUser.save();
                return savedUser;
        }
    } catch (e) {
        console.log(e);
        throw Error("Error while creating tenant user")
    }
}


const checkCredentials = async function (email, password) {
    console.log("02- Busca las credenciales del usuario")
    var user = await Credentials.find({
        email
    })
    if (password === user[0].password) {
        return true;
    } else {
        return false;
    }
}

const checkEmail = async function (email) {
    console.log("02- Busca las credenciales del usuario")
    var isEmailRegistered = await Credentials.exists({
        email
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

//Almost equal to 'getUser' method, refactor this
//CORREGIR EL EXIST NO FUNCA
const checkEmailTenant = async function (email, tenant) {

    switch (tenant) {
        case 'cms':
            var isUserRegistered = await CMS.exists({
                email
            });
            return isUserRegistered;
        case 'facturacion':
            var isUserRegistered = await Facturacion.exists({
                email
            });
            return isUserRegistered;
        case 'mobile':
            var isUserRegistered = await Mobile.exists({
                email
            });
            return isUserRegistered;
        case 'suscripciones':
            var isUserRegistered = await Suscripciones.exists({
                email
            });
            return isUserRegistered;
        case 'web':
            var isUserRegistered = await Web.exists({
                email
            });
            return isUserRegistered;
    }
}

const getUser = async function (email, tenant) {
    console.log("05- Buscando informacion correspondiente al user y tenant")
    switch (tenant) {
        case 'cms':
            var user = await CMS.find({
                email
            });
            return user[0];
        case 'facturacion':
            var user = await Facturacion.find({
                email
            });
            return user[0];
        case 'mobile':
            var user = await Mobile.find({
                email
            });
            return user[0];
        case 'suscripciones':
            var user = await Suscripciones.find({
                email
            });
            return user[0];
        case 'web':
            var user = await Web.find({
                email
            });
            return user[0];
    }
}

module.exports = {
    checkCredentials,
    checkTenantInfo,
    getUser,
    createUser
}


/*
// Saving the context of this module inside the _the variable
_this = this

// Async function to get the User List
exports.getUsers = async function (query, page, limit) {

    // Options setup for the mongoose paginate
    var options = {
        page,
        limit
    }
    // Try Catch the awaited promise to handle the error 
    try {
        var Users = await User.paginate(query, options)
        // Return the Userd list that was retured by the mongoose promise
        return Users;

    } catch (e) {
        // return a Error message describing the reason 
        throw Error('Error while Paginating Users');
    }
}

exports.createUser = async function (user) {
    // Creating a new Mongoose Object by using the new keyword
    var hashedPassword = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
    var newUser = new User({
        name: user.name,
        email: user.email,
        date: new Date(),
        password: hashedPassword
    })

    try {
        // Saving the User 
        var savedUser = await newUser.save();
        var token = jwt.sign({
            id: savedUser._id
        }, process.env.SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });
        return token;
    } catch (e) {
        // return a Error message describing the reason 
        console.log(e)    
        throw Error("Error while Creating User")
    }
}

exports.updateUser = async function (user) {
    var id = user.id
    try {
        //Find the old User Object by the Id
        var oldUser = await User.findById(id);
    } catch (e) {
        throw Error("Error occured while Finding the User")
    }
    // If no old User Object exists return false
    if (!oldUser) {
        return false;
    }
    //Edit the User Object
    oldUser.name = user.name
    oldUser.email = user.email
    oldUser.password = user.password
    try {
        var savedUser = await oldUser.save()
        return savedUser;
    } catch (e) {
        throw Error("And Error occured while updating the User");
    }
}

exports.deleteUser = async function (id) {

    // Delete the User
    try {
        var deleted = await User.remove({
            _id: id
        })
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("User Could not be deleted")
        }
        return deleted;
    } catch (e) {
        throw Error("Error Occured while Deleting the User")
    }
}


exports.loginUser = async function (user) {

    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 
        var _details = await User.findOne({
            email: user.email
        });
        var passwordIsValid = bcrypt.compareSync(user.password, _details.password);
        if (!passwordIsValid) throw Error("Invalid username/password")

        var token = jwt.sign({
            id: _details._id
        }, process.env.SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });
        return token;
    } catch (e) {
        // return a Error message describing the reason     
        throw Error("Error while Login User")
    }

}*/