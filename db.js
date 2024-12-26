const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createPool({
  host: process.env.host,
  user: process.env.user, 
  password: process.env.password, 
  database: process.env.database,
});

module.exports = db;
