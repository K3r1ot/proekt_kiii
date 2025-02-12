const sql = require("mssql");
require("dotenv").config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT, 10),
    options: {
        encrypt: false, // Set to true if using Azure MSSQL
        trustServerCertificate: true,
    },
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then((pool) => {
        console.log("Connected to MSSQL");
        return pool;
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
        process.exit(1);
    });

module.exports = {
    sql,
    poolPromise,
};
