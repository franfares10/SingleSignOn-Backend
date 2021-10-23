# Single Sign On - Backend

Web server built in Node.js with Express.js for the backend of the Application Integration project (UADE 2021). This backend allows you to log in and register users. Using the JWT protocol to generate the user tokens.
![image](https://miro.medium.com/max/2000/1*YsFDKm7rl77RLGf3m9WytA.png)

## Heroku cloud deployed version

If you want to view the project without having to install it locally, you can access the version deployed in Heroku [clicking here!](https://singlesignonbackend.herokuapp.com/)

## Swagger of the project

If you want to use our SSO, you can view our swagger to connect with us: https://singlesignonbackend.herokuapp.com/api-docs

## Installation and local deployment

Use the [node package manager](https://www.npmjs.com/) commands after clone the repository to install all the necessary dependencies to run the project locally.

```bash
npm install
```

Once the dependencies are installed, use this command to run the server on the default 3002 port.

```bash
npm run start
```

## MongoDB Database
Our database is implemented using MongoDB, a NoSQL database system. It is deployed in [Mongo Atlas](https://www.mongodb.com/cloud/atlas), a global cloud database service for modern applications.
To access it you can use [Mongo Compass](https://www.mongodb.com/products/compass), the GUI for MongoDB.
We provide you with the following connection string to access the records and collections of the database with read-only permission through Mongo Compass:
```bash
mongodb+srv://readOnly:readOnly@cluster0.iafee.mongodb.net/appInteractivasDataBase
```

## Authors
- Lautaro Mitelman
- Valentin Saettone
- Francisco Fares
- Iván Ponce
- Marco Mercurio
- Julian Armagno
- Lucas Rial
- Cristhian Apolitano 

## License
[MIT](https://choosealicense.com/licenses/mit/)