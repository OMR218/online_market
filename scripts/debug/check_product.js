// Check if image column has data
const pool = require('../../backend/config/database');

async function checkProduct() {
    try {
        const connection = await pool.getConnection();
        
        const [product] = await connection.query('SELECT * FROM product WHERE product_id = 18');
        console.log('Product from DB:', product[0]);
        
        connection.release();
    } catch (err) {
        console.error('Error:', err.message);
    }
    process.exit();
}

checkProduct();
