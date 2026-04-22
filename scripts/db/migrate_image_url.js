// Apply database migration to add image_url column
const pool = require('../../backend/config/database');

async function migrate() {
    try {
        const connection = await pool.getConnection();
        
        console.log('Running migration: adding image_url column...');
        try {
            await connection.query('ALTER TABLE product ADD COLUMN image_url VARCHAR(500) DEFAULT NULL AFTER price');
            console.log('✅ image_url column added successfully');
        } catch (e) {
            if (e.message.includes('Duplicate column')) {
                console.log('✅ image_url column already exists');
            } else {
                throw e;
            }
        }
        
        connection.release();
        console.log('\n✅ Migration complete!');
    } catch (err) {
        console.error('Error:', err.message);
    }
    process.exit();
}

migrate();
