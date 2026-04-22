// Check image_url column definition
const pool = require('../../backend/config/database');

async function checkColumn() {
    try {
        const connection = await pool.getConnection();
        
        const [columns] = await connection.query('DESCRIBE product');
        console.log('Product table columns:');
        columns.forEach(col => {
            if (col.Field === 'image_url' || col.Field.includes('image')) {
                console.log(JSON.stringify(col, null, 2));
            }
        });
        
        // Try a direct update
        console.log('\nAttempting direct update...');
        const result = await connection.query(
            'UPDATE product SET image_url = ? WHERE product_id = ?',
            ['https://example.com/test.jpg', 18]
        );
        console.log('Update result:', result);
        
        // Check the value was set
        const [product] = await connection.query('SELECT image_url FROM product WHERE product_id = 18');
        console.log('\nProduct image_url after direct update:', product[0]);
        
        connection.release();
    } catch (err) {
        console.error('Error:', err.message);
    }
    process.exit();
}

checkColumn();
