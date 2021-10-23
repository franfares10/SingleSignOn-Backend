const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect( process.env.DB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('DB online!');
    } catch (error) {
        console.log(error);
        throw new Error('Error en conexión con base')
    }

}

module.exports = {
    dbConnection
}