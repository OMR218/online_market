// Check if image_url was saved for product 19
const pool = require('../../backend/config/database');

(async() => {
    try {
        const c = await pool.getConnection();
        const [rows] = await c.query('SELECT * FROM product WHERE product_id = 19');
        console.log('Product 19:', JSON.stringify(rows[0], null, 2));
        c.release();
    } catch (err) {
        console.error('Error:', err.message);
    }
    process.exit();
})();
