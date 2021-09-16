var Credentials = require('../models/Credentials.model');
var Tenant = require('../models/Tenant.model');
var CMS = require('../models/Cms.model');
var Facturacion = require('../models/Facturacion.model');
var Mobile = require('../models/Mobile.model');
var Suscripciones = require('../models/Suscripciones.model');
var Web = require('../models/Web.model');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


const createUser = async function (user) {
    // Creating a new Mongoose Object by using the new keyword

    try {

        var isUserRegistered = await checkEmail(user.email);
        if(!isUserRegistered){
            var newUser = new Credentials(user);
             // Saving the User 
            var savedUser = await newUser.save();
            var token = jwt.sign({
                id: savedUser._id
            }, process.env.SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            return token;
        }

       
    } catch (e) {
        // return a Error message describing the reason 
        console.log(e)    
        throw Error("Error while Creating User")
    }
}


const checkCredentials = async function (email,password) {
    console.log("02- Busca las credenciales del usuario")
    var user = await Credentials.find({email})
    if (password === user[0].password) {
        return true;
    } else {
        return false;
    }
}

const checkEmail = async function (email) {
    console.log("02- Busca las credenciales del usuario")
    var user = await Credentials.find({email})
    if (user.email != null) {
        return true;
    } else {
        return false;
    }
}

const checkTenantInfo = async function (tenant){
    console.log("04- Informacion del tenant de la base")
    var TenantInfo = await Tenant.find({name:tenant});
    return TenantInfo[0];

}

const getUser = async function(email,tenant){
    console.log("05- Buscando informacion correspondiente al user y tenant")
    switch(tenant){
        case 'cms':
            var user = await CMS.find({email});
            return user[0];
        case 'facturacion':
            var user = await Facturacion.find({email});
            return user[0];
        case 'mobile':
            var user = await Mobile.find({email});
            return user[0];
        case 'suscripciones':
            var user = await Suscripciones.find({email});
            return user[0];
        case 'web':
            var user = await Web.find({email});
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