// Required imports
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
swaggerDocument = require('./swagger.json');
const { dbConnection } = require('./database/config');

// Database
dbConnection();

// Express
const app = express();

// CORS & Environment
app.use(cors());

// Request's Body parsing
app.use(express.json({ limit: '50mb' }));


// Default GET method
app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Welcome to Aplicaciones Distribuidas Backend',
    });
});


// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Paths
app.use('/api/users', require('./routes/users.routes'));

app.listen(process.env.PORT, () => {
    console.log('Example app listening on port ' + process.env.PORT);
});