const mysql = require('mysql2');

const dbConfig = {
    host: "sqlclassdb-instance-1.cqjxl5z5vyvr.us-east-2.rds.amazonaws.com",
    port: 3306,
    user: "jeatel25",
    password: "uH8zBykma7zy",
    database: "webapp_p8_2223t2_jeatel25",
    connectTimeout: 10000
}

const connection = mysql.createConnection(dbConfig);

module.exports = connection;