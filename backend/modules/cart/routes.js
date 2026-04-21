// Cart Routes
const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, clearCart } = require('./controller');

// GET /cart/:personId - Get cart items
router.get('/:personId', getCart);

// POST /cart/add - Add item to cart
router.post('/add', addToCart);

// DELETE /cart/item/:itemId - Remove item
router.delete('/item/:itemId', removeFromCart);

// DELETE /cart/clear/:personId - Clear cart
router.delete('/clear/:personId', clearCart);

module.exports = router;
