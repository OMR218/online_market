// Users Controller
// Handles user/customer management with the new advanced schema

const pool = require('../config/database');

// Get all customers
async function getAllCustomers(req, res) {
    try {
        const connection = await pool.getConnection();
        
        const [customers] = await connection.query(`
            SELECT 
                c.person_id,
                p.first_name,
                p.second_name,
                p.last_name,
                c.email,
                c.created_at
            FROM customer c
            JOIN person p ON c.person_id = p.person_id
        `);
        
        connection.release();
        
        res.status(200).json({
            success: true,
            data: customers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// Get customer by ID with detailed information
async function getCustomerById(req, res) {
    try {
        const { personId } = req.params;
        const connection = await pool.getConnection();
        
        // Get customer basic info
        const [customers] = await connection.query(`
            SELECT 
                c.person_id,
                p.first_name,
                p.second_name,
                p.last_name,
                c.email,
                c.created_at
            FROM customer c
            JOIN person p ON c.person_id = p.person_id
            WHERE c.person_id = ?
        `, [personId]);
        
        if (customers.length === 0) {
            connection.release();
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }
        
        // Get phones
        const [phones] = await connection.query(
            'SELECT phone_id, phone FROM phone WHERE person_id = ?',
            [personId]
        );
        
        // Get addresses
        const [addresses] = await connection.query(`
            SELECT 
                a.address_id,
                a.street,
                a.city,
                a.postal_code,
                a.country,
                CASE 
                    WHEN ha.address_id IS NOT NULL THEN 'home'
                    WHEN wa.address_id IS NOT NULL THEN 'work'
                    ELSE 'other'
                END as type
            FROM address a
            LEFT JOIN home_address ha ON a.address_id = ha.address_id
            LEFT JOIN work_address wa ON a.address_id = wa.address_id
            WHERE a.person_id = ?
        `, [personId]);
        
        connection.release();
        
        res.status(200).json({
            success: true,
            data: {
                ...customers[0],
                phones: phones,
                addresses: addresses
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// Create new customer
async function createCustomer(req, res) {
    try {
        const { first_name, second_name, last_name, email, password, phone, address, city, postal_code, country } = req.body;
        
        if (!first_name || !last_name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: first_name, last_name, email'
            });
        }
        
        const connection = await pool.getConnection();
        
        try {
            // Insert person
            const [personResult] = await connection.query(
                'INSERT INTO person (first_name, second_name, last_name) VALUES (?, ?, ?)',
                [first_name, second_name || null, last_name]
            );
            const personId = personResult.insertId;
            
            // Insert customer
            await connection.query(
                'INSERT INTO customer (person_id, email, password) VALUES (?, ?, ?)',
                [personId, email, password || null]
            );
            
            // Insert phone if provided
            if (phone) {
                await connection.query(
                    'INSERT INTO phone (person_id, phone) VALUES (?, ?)',
                    [personId, phone]
                );
            }
            
            // Insert address if provided
            if (address && city && country) {
                const [addressResult] = await connection.query(
                    'INSERT INTO address (person_id, street, city, postal_code, country) VALUES (?, ?, ?, ?, ?)',
                    [personId, address, city, postal_code || null, country]
                );
                
                // Add as home address
                await connection.query(
                    'INSERT INTO home_address (address_id) VALUES (?)',
                    [addressResult.insertId]
                );
            }
            
            // Create cart for customer
            await connection.query('INSERT INTO cart (person_id) VALUES (?)', [personId]);
            
            connection.release();
            
            res.status(201).json({
                success: true,
                message: 'Customer created successfully',
                personId: personId
            });
        } catch (err) {
            connection.release();
            throw err;
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// Update customer
async function updateCustomer(req, res) {
    try {
        const { personId } = req.params;
        const { first_name, second_name, last_name, email, phone } = req.body;
        
        const connection = await pool.getConnection();
        
        try {
            // Check if customer exists
            const [customer] = await connection.query('SELECT person_id FROM customer WHERE person_id = ?', [personId]);
            
            if (customer.length === 0) {
                connection.release();
                return res.status(404).json({
                    success: false,
                    message: 'Customer not found'
                });
            }
            
            // Update person info
            await connection.query(
                'UPDATE person SET first_name = ?, second_name = ?, last_name = ? WHERE person_id = ?',
                [first_name, second_name || null, last_name, personId]
            );
            
            // Update email
            if (email) {
                await connection.query(
                    'UPDATE customer SET email = ? WHERE person_id = ?',
                    [email, personId]
                );
            }
            
            // Update phone if provided
            if (phone) {
                const [existingPhone] = await connection.query(
                    'SELECT phone_id FROM phone WHERE person_id = ? LIMIT 1',
                    [personId]
                );
                
                if (existingPhone.length > 0) {
                    await connection.query(
                        'UPDATE phone SET phone = ? WHERE phone_id = ?',
                        [phone, existingPhone[0].phone_id]
                    );
                } else {
                    await connection.query(
                        'INSERT INTO phone (person_id, phone) VALUES (?, ?)',
                        [personId, phone]
                    );
                }
            }
            
            connection.release();
            
            res.status(200).json({
                success: true,
                message: 'Customer updated successfully'
            });
        } catch (err) {
            connection.release();
            throw err;
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer
};
