const pool = require('./backend/config/database');

(async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT COUNT(*) AS count FROM product');
    console.log(JSON.stringify(rows[0]));
    connection.release();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
})();
