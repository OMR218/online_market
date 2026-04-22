// Orders Controller
// Handles business logic for orders
// Uses new schema with person_id and delivery system

const pool = require('../../config/database');

// Create order from cart
async function createOrder(req, res) {
    let connection;
    try {
        const personId = req.body.personId || req.body.person_id;
        const shippingAddressId = req.body.shippingAddressId || req.body.shipping_add_id || null;
        const paymentMethod = (req.body.paymentMethod || req.body.payment_method || 'cash').toLowerCase();
        const paymentStatus = req.body.paymentStatus || req.body.payment_status || 'pending';
        const transactionId = req.body.transactionId || req.body.transaction_id || null;
        const paymentGateway = req.body.paymentGateway || req.body.payment_gateway || null;
        const cardHolder = req.body.cardHolder || req.body.card_holder || null;
        const cardNumber = req.body.cardNumber || req.body.card_number || null;
        
        if (!personId) {
            return res.status(400).json({
                success: false,
                message: 'Person ID required'
            });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        // Get cart
        const [cart] = await connection.query('SELECT cart_id FROM cart WHERE person_id = ?', [personId]);
        
        if (cart.length === 0 || !cart[0].cart_id) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }
        
        // Get cart items
        const [cartItems] = await connection.query(`
            SELECT ci.product_id, ci.quantity, p.price
            FROM cart_item ci
            JOIN product p ON ci.product_id = p.product_id
            WHERE ci.cart_id = ?
        `, [cart[0].cart_id]);
        
        if (cartItems.length === 0) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }
        
        // Calculate total
        const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Create order
        const [orderResult] = await connection.query(
            'INSERT INTO orders (person_id, total_amount, status, shipping_add_id) VALUES (?, ?, ?, ?)',
            [personId, totalAmount, 'pending', shippingAddressId || null]
        );
        
        const orderId = orderResult.insertId;
        
        // Add order items
        for (const item of cartItems) {
            const subtotal = item.price * item.quantity;
            await connection.query(
                'INSERT INTO order_item (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price]
            );
            
            // Update product stock
            await connection.query(
                'UPDATE product SET stock_quantity = stock_quantity - ? WHERE product_id = ?',
                [item.quantity, item.product_id]
            );
        }
        
        // Clear cart
        await connection.query('DELETE FROM cart_item WHERE cart_id = ?', [cart[0].cart_id]);

        // Create payment according to selected method
        const [paymentResult] = await connection.query(
            'INSERT INTO payment (order_id, status, amount) VALUES (?, ?, ?)',
            [orderId, paymentStatus, totalAmount]
        );

        const paymentId = paymentResult.insertId;
        if (paymentMethod === 'online') {
            await connection.query(
                'INSERT INTO online_payment (payment_id, transaction_id, payment_gateway) VALUES (?, ?, ?)',
                [paymentId, transactionId, paymentGateway]
            );
        } else if (paymentMethod === 'card') {
            await connection.query(
                'INSERT INTO card_payment (payment_id, card_holder, card_number) VALUES (?, ?, ?)',
                [paymentId, cardHolder, cardNumber]
            );
        } else {
            await connection.query(
                'INSERT INTO cash_payment (payment_id) VALUES (?)',
                [paymentId]
            );
        }

        await connection.commit();
        
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            orderId: orderId,
            totalAmount: totalAmount,
            payment: {
                paymentId,
                method: paymentMethod,
                status: paymentStatus
            }
        });
    } catch (error) {
        if (connection) {
            await connection.rollback().catch(() => {});
        }
        res.status(500).json({
            success: false,
            error: error.message
        });
    } finally {
        if (connection) connection.release();
    }
}

// Get all orders for a customer
async function getCustomerOrders(req, res) {
    try {
        const { personId } = req.params;
        const connection = await pool.getConnection();
        
        const [orders] = await connection.query(`
            SELECT 
                o.order_id,
                o.total_amount,
                o.status,
                o.created_at
            FROM orders o
            WHERE o.person_id = ?
            ORDER BY o.created_at DESC
        `, [personId]);
        
        connection.release();
        
        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// Get order details
async function getOrderDetails(req, res) {
    try {
        const { orderId } = req.params;
        const connection = await pool.getConnection();
        
        const [orders] = await connection.query('SELECT * FROM orders WHERE order_id = ?', [orderId]);
        
        if (orders.length === 0) {
            connection.release();
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        const [orderItems] = await connection.query(`
            SELECT 
                oi.order_item_id,
                oi.product_id,
                p.name,
                oi.quantity,
                oi.price,
                (oi.quantity * oi.price) as subtotal
            FROM order_item oi
            JOIN product p ON oi.product_id = p.product_id
            WHERE oi.order_id = ?
        `, [orderId]);
        
        // Get delivery info if exists
        const [delivery] = await connection.query(`
            SELECT d.delivery_id, d.delivery_status
            FROM delivery d
            WHERE d.order_id = ?
        `, [orderId]);
        
        connection.release();
        
        res.status(200).json({
            success: true,
            data: {
                order: orders[0],
                items: orderItems,
                delivery: delivery.length > 0 ? delivery[0] : null
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// Update order status
async function updateOrderStatus(req, res) {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status required'
            });
        }
        
        const connection = await pool.getConnection();
        await connection.query('UPDATE orders SET status = ? WHERE order_id = ?', [status, orderId]);
        connection.release();
        
        res.status(200).json({
            success: true,
            message: 'Order status updated'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = {
    createOrder,
    getCustomerOrders,
    getOrderDetails,
    updateOrderStatus
};
