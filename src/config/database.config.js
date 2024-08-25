const mysql = require("mysql");
require("dotenv").config();

const pool = mysql.createPool({
  queueLimit: 10,
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3307,
  database: process.env.DB_NAME || "e-commerce-database",
  password: process.env.DB_PASSWORD || "",
  user: process.env.DB_USER || "",
});

module.exports = pool;
// module.exports = pool().promise();
