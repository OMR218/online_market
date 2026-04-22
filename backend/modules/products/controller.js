// Products Controller
// Handles business logic for products with support for product types (Electronics, Food, Clothing)

const pool = require('../../config/database');

// Get all products with type information
async function getAllProducts(req, res) {
    try {
        const connection = await pool.getConnection();
        
        // Get all products
        const [products] = await connection.query(`
            SELECT 
                p.product_id,
                p.name,
                p.stock_quantity,
                p.description,
                p.price,
                p.image_url,
                CASE 
                    WHEN e.product_id IS NOT NULL THEN 'electronics'
                    WHEN f.product_id IS NOT NULL THEN 'food'
                    WHEN c.product_id IS NOT NULL THEN 'clothing'
                    ELSE 'general'
                END as type
            FROM product p
            LEFT JOIN electronics e ON p.product_id = e.product_id
            LEFT JOIN food f ON p.product_id = f.product_id
            LEFT JOIN clothing c ON p.product_id = c.product_id
        `);
        
        connection.release();
        
        res.status(200).json({
            success: true,
            data: products,
            message: 'Products retrieved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// Get single product by ID with type details
async function getProductById(req, res) {
    try {
        const { productId } = req.params;
        const connection = await pool.getConnection();
        
        const [product] = await connection.query(`
            SELECT 
                p.product_id,
                p.name,
                p.stock_quantity,
                p.description,
                p.price,
                p.image_url,
                CASE 
                    WHEN e.product_id IS NOT NULL THEN 'electronics'
                    WHEN f.product_id IS NOT NULL THEN 'food'
                    WHEN c.product_id IS NOT NULL THEN 'clothing'
                    ELSE 'general'
                END as type
            FROM product p
            LEFT JOIN electronics e ON p.product_id = e.product_id
            LEFT JOIN food f ON p.product_id = f.product_id
            LEFT JOIN clothing c ON p.product_id = c.product_id
            WHERE p.product_id = ?
        `, [productId]);
        
        connection.release();
        
        if (product.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: product[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// Add new product
async function addProduct(req, res) {
    try {
        const { name, description, price, stock_quantity, type, image_url } = req.body;
        
        if (!name || !price || stock_quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, price, stock_quantity'
            });
        }
        
        const connection = await pool.getConnection();
        const [result] = await connection.query(
            'INSERT INTO product (name, description, price, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, stock_quantity, image_url || null]
        );
        
        const productId = result.insertId;
        
        // Insert into appropriate subtype table
        if (type === 'electronics') {
            await connection.query(
                'INSERT INTO electronics (product_id, warranty, brand) VALUES (?, ?, ?)',
                [productId, 12, 'Generic']
            );
        } else if (type === 'food') {
            await connection.query(
                'INSERT INTO food (product_id, exp_date, storage_type) VALUES (?, ?, ?)',
                [productId, new Date(Date.now() + 30*24*60*60*1000), 'Pantry']
            );
        } else if (type === 'clothing') {
            await connection.query(
                'INSERT INTO clothing (product_id, size, material, color) VALUES (?, ?, ?, ?)',
                [productId, 'M', 'Cotton', 'Various']
            );
        }
        
        connection.release();
        
        res.status(201).json({
            success: true,
            message: 'Product added successfully',
            productId: productId,
            type: type || 'general'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// Update product
async function updateProduct(req, res) {
    try {
        const { productId } = req.params;
        const { name, description, price, stock_quantity, image_url, type } = req.body;
        console.log('Update params:', { name, description, price, stock_quantity, image_url, type });
        
        const connection = await pool.getConnection();
        await connection.query(
            'UPDATE product SET name = ?, description = ?, price = ?, stock_quantity = ?, image_url = ? WHERE product_id = ?',
            [name, description, price, stock_quantity, image_url || null, productId]
        );
        
        if (type) {
            await connection.query('DELETE FROM electronics WHERE product_id = ?', [productId]);
            await connection.query('DELETE FROM food WHERE product_id = ?', [productId]);
            await connection.query('DELETE FROM clothing WHERE product_id = ?', [productId]);
            
            if (type === 'electronics') {
                await connection.query('INSERT IGNORE INTO electronics (product_id, warranty, brand) VALUES (?, ?, ?)', [productId, 12, 'Generic']);
            } else if (type === 'food') {
                const futureDate = new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0];
                await connection.query('INSERT IGNORE INTO food (product_id, exp_date, storage_type) VALUES (?, ?, ?)', [productId, futureDate, 'Pantry']);
            } else if (type === 'clothing') {
                await connection.query('INSERT IGNORE INTO clothing (product_id, size, material, color) VALUES (?, ?, ?, ?)', [productId, 'M', 'Cotton', 'Various']);
            }
        }
        
        connection.release();
        
        res.status(200).json({
            success: true,
            message: 'Product updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// Delete product
async function deleteProduct(req, res) {
    try {
        const { productId } = req.params;
        const connection = await pool.getConnection();
        await connection.query('DELETE FROM product WHERE product_id = ?', [productId]);
        connection.release();
        
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// Add electronics product
async function addElectronicsProduct(req, res) {
    try {
        const { name, description, price, stock_quantity, warranty, brand } = req.body;
        
        if (!name || !price || stock_quantity === undefined || !warranty || !brand) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields for electronics'
            });
        }
        
        const connection = await pool.getConnection();
        
        // Insert product
        const [result] = await connection.query(
            'INSERT INTO product (name, description, price, stock_quantity) VALUES (?, ?, ?, ?)',
            [name, description, price, stock_quantity]
        );
        
        // Insert electronics details
        await connection.query(
            'INSERT INTO electronics (product_id, warranty, brand) VALUES (?, ?, ?)',
            [result.insertId, warranty, brand]
        );
        
        connection.release();
        
        res.status(201).json({
            success: true,
            message: 'Electronics product added successfully',
            productId: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    addElectronicsProduct
};
