// Cart Controller
// Handles business logic for cart management
// Works with new schema using person_id for customers

const pool = require('../config/database');

// Get cart items for a customer
async function getCart(req, res) {
    try {
        const { personId } = req.params;
        const connection = await pool.getConnection();
        
        // Get cart
        const [cart] = await connection.query('SELECT cart_id FROM cart WHERE person_id = ?', [personId]);
        
        if (cart.length === 0) {
            connection.release();
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }
        
        const cartId = cart[0].cart_id;
        
        // Get cart items with product details
        const [cartItems] = await connection.query(`
            SELECT 
                ci.cart_item_id as id,
                ci.product_id,
                p.name,
                p.price,
                ci.quantity,
                (p.price * ci.quantity) as subtotal
            FROM cart_item ci
            JOIN product p ON ci.product_id = p.product_id
            WHERE ci.cart_id = ?
        `, [cartId]);
        
        connection.release();
        
        // Calculate total
        const total = cartItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
        
        res.status(200).json({
            success: true,
            data: {
                cartId: cartId,
                items: cartItems,
                total: total,
                itemCount: cartItems.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// Add item to cart
async function addToCart(req, res) {
    try {
        const { personId, productId, quantity } = req.body;
        
        if (!personId || !productId || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: personId, productId, quantity'
            });
        }
        
        const connection = await pool.getConnection();
        
        // Get or create cart
        const [cart] = await connection.query('SELECT cart_id FROM cart WHERE person_id = ?', [personId]);
        let cartId;
        
        if (cart.length === 0) {
            const [result] = await connection.query('INSERT INTO cart (person_id) VALUES (?)', [personId]);
            cartId = result.insertId;
        } else {
            cartId = cart[0].cart_id;
        }
        
        // Check if item already in cart
        const [existing] = await connection.query(
            'SELECT cart_item_id, quantity FROM cart_item WHERE cart_id = ? AND product_id = ?',
            [cartId, productId]
        );
        
        if (existing.length > 0) {
            // Update quantity
            await connection.query(
                'UPDATE cart_item SET quantity = quantity + ? WHERE cart_item_id = ?',
                [quantity, existing[0].cart_item_id]
            );
        } else {
            // Add new item
            await connection.query(
                'INSERT INTO cart_item (cart_id, product_id, quantity) VALUES (?, ?, ?)',
                [cartId, productId, quantity]
            );
        }
        
        connection.release();
        
        res.status(201).json({
            success: true,
            message: 'Item added to cart'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// Remove item from cart
async function removeFromCart(req, res) {
    try {
        const { itemId } = req.params;
        const connection = await pool.getConnection();
        
        await connection.query('DELETE FROM cart_item WHERE cart_item_id = ?', [itemId]);
        connection.release();
        
        res.status(200).json({
            success: true,
            message: 'Item removed from cart'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// Clear cart
async function clearCart(req, res) {
    try {
        const { personId } = req.params;
        const connection = await pool.getConnection();
        
        const [cart] = await connection.query('SELECT cart_id FROM cart WHERE person_id = ?', [personId]);
        
        if (cart.length > 0) {
            await connection.query('DELETE FROM cart_item WHERE cart_id = ?', [cart[0].cart_id]);
        }
        
        connection.release();
        
        res.status(200).json({
            success: true,
            message: 'Cart cleared'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = {
    getCart,
    addToCart,
    removeFromCart,
    clearCart
};
