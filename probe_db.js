const pool = require('./backend/config/database');

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('connected');
    connection.release();
  } catch (error) {
    console.error('connect_error', error.code, error.message);
    process.exitCode = 1;
  }
})();
