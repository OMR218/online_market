// Fix product types by adding to food and clothing tables
const pool = require('../../backend/config/database');

async function fixProductTypes() {
    try {
        const connection = await pool.getConnection();
        
        // Get the food products
        const foodNames = ['Organic Apples', 'Almond Butter', 'Greek Yogurt', 'Whole Wheat Bread', 'Free Range Eggs'];
        const clothingNames = ['Cotton T-Shirt', 'Blue Jeans', 'Running Shoes', 'Winter Jacket', 'Summer Dress'];
        
        console.log('Adding food products...');
        for (const name of foodNames) {
            const [products] = await connection.query('SELECT product_id FROM product WHERE name = ?', [name]);
            if (products.length > 0) {
                const productId = products[0].product_id;
                try {
                    await connection.query(
                        'INSERT INTO food (product_id, exp_date, storage_type) VALUES (?, DATE_ADD(NOW(), INTERVAL 30 DAY), ?)',
                        [productId, 'Pantry']
                    );
                    console.log(`✅ ${name} (ID: ${productId}) added to food table`);
                } catch (e) {
                    console.log(`⚠️ ${name} already in food table or error`);
                }
            }
        }
        
        console.log('\nAdding clothing products...');
        for (const name of clothingNames) {
            const [products] = await connection.query('SELECT product_id FROM product WHERE name = ?', [name]);
            if (products.length > 0) {
                const productId = products[0].product_id;
                try {
                    await connection.query(
                        'INSERT INTO clothing (product_id, size, material, color) VALUES (?, ?, ?, ?)',
                        [productId, 'M', 'Cotton', 'Various']
                    );
                    console.log(`✅ ${name} (ID: ${productId}) added to clothing table`);
                } catch (e) {
                    console.log(`⚠️ ${name} already in clothing table or error`);
                }
            }
        }
        
        connection.release();
        console.log('\n✅ All products fixed!');
    } catch (err) {
        console.error('Error:', err.message);
    }
    process.exit();
}

fixProductTypes();
