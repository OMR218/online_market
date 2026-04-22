// Cart Controller
// Handles business logic for cart management
// Works with new schema using person_id for customers

const pool = require('../../config/database');

async function ensureValidCustomer(connection, requestedPersonId) {
    if (requestedPersonId) {
        const [existingCustomer] = await connection.query(
            'SELECT person_id FROM customer WHERE person_id = ? LIMIT 1',
            [requestedPersonId]
        );
        if (existingCustomer.length > 0) {
            return requestedPersonId;
        }
    }

    const [firstCustomer] = await connection.query(
        'SELECT person_id FROM customer ORDER BY person_id ASC LIMIT 1'
    );

    if (firstCustomer.length > 0) {
        return firstCustomer[0].person_id;
    }

    const [personResult] = await connection.query(
        'INSERT INTO person (first_name, second_name, last_name) VALUES (?, ?, ?)',
        ['Guest', null, 'User']
    );

    const personId = personResult.insertId;
    const guestEmail = `guest_${Date.now()}@example.com`;
    await connection.query(
        'INSERT INTO customer (person_id, email, password) VALUES (?, ?, ?)',
        [personId, guestEmail, null]
    );

    return personId;
}

// Get cart items for a customer
async function getCart(req, res) {
    let connection;
    try {
        const { personId } = req.params;
        connection = await pool.getConnection();
        
        // Get cart
        const [cart] = await connection.query('SELECT cart_id FROM cart WHERE person_id = ?', [personId]);
        
        if (cart.length === 0) {
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
                p.name as product_name,
                p.price,
                ci.quantity,
                (p.price * ci.quantity) as subtotal
            FROM cart_item ci
            JOIN product p ON ci.product_id = p.product_id
            WHERE ci.cart_id = ?
        `, [cartId]);
        
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
    } finally {
        if (connection) connection.release();
    }
}

// Add item to cart
async function addToCart(req, res) {
    let connection;
    try {
        const personIdRaw = req.body.personId || req.body.person_id;
        const productIdRaw = req.body.productId || req.body.product_id;
        const personId = personIdRaw ? parseInt(personIdRaw, 10) : null;
        const productId = productIdRaw ? parseInt(productIdRaw, 10) : null;
        const quantity = parseInt(req.body.quantity, 10);
        
        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: productId, quantity'
            });
        }
        
        connection = await pool.getConnection();
        const resolvedPersonId = await ensureValidCustomer(connection, personId);

        // Ensure product exists
        const [product] = await connection.query(
            'SELECT product_id FROM product WHERE product_id = ? LIMIT 1',
            [productId]
        );
        if (product.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        // Get or create cart
        const [cart] = await connection.query('SELECT cart_id FROM cart WHERE person_id = ?', [resolvedPersonId]);
        let cartId;
        
        if (cart.length === 0) {
            const [result] = await connection.query('INSERT INTO cart (person_id) VALUES (?)', [resolvedPersonId]);
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
        
        res.status(201).json({
            success: true,
            message: 'Item added to cart',
            personId: resolvedPersonId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    } finally {
        if (connection) connection.release();
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
