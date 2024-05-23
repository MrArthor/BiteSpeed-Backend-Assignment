const pool = require('./db');

const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Database connection successful!');
    client.release();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};
module.exports =testConnection;
