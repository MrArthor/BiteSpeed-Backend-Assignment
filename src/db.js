const { Pool } = require('pg');

const pool = new Pool({
  user: 'onlinedatabase_ke7q_user', // Replace with your actual PostgreSQL username
  host: 'pg-cp7faq7sc6pc73a8srm0-a.oregon-postgres.render.com', // Replace with your actual PostgreSQL host
  database: 'onlinedatabase_ke7q', // Replace with your actual PostgreSQL database name
  password: 'aLXlq0xprRAWvdwsQJKUQaoEfdGLCVYr', // Replace with your actual PostgreSQL password
  port: 5432, // Replace with your actual PostgreSQL port if different
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
// postgres://onlinedatabase_ke7q_user:aLXlq0xprRAWvdwsQJKUQaoEfdGLCVYr@dpg-cp7faq7sc6pc73a8srm0-a.oregon-postgres.render.com/onlinedatabase_ke7q