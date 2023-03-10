const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectTimeout: process.env.DB_CONNECT_TIMEOUT
}


const connection = mysql.createConnection(dbConfig);

module.exports = connection;