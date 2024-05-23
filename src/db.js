const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
// postgres://onlinedatabase_ke7q_user:aLXlq0xprRAWvdwsQJKUQaoEfdGLCVYr@dpg-cp7faq7sc6pc73a8srm0-a.oregon-postgres.render.com/onlinedatabase_ke7q