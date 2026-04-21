// Orders Routes
const express = require('express');
const router = express.Router();
const { createOrder, getCustomerOrders, getOrderDetails, updateOrderStatus } = require('./controller');

// POST /orders - Create new order
router.post('/', createOrder);

// GET /orders/:personId - Get all orders for customer
router.get('/:personId', getCustomerOrders);

// GET /orders/details/:orderId - Get order details
router.get('/details/:orderId', getOrderDetails);

// PUT /orders/:orderId/status - Update order status
router.put('/:orderId/status', updateOrderStatus);

module.exports = router;
