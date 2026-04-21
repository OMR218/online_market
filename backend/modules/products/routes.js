// Products Routes
const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct, addElectronicsProduct } = require('./controller');

// GET /products - Get all products
router.get('/', getAllProducts);

// GET /products/:productId - Get single product
router.get('/:productId', getProductById);

// POST /products - Add new product
router.post('/', addProduct);

// POST /products/electronics - Add electronics product
router.post('/electronics', addElectronicsProduct);

// PUT /products/:productId - Update product
router.put('/:productId', updateProduct);

// DELETE /products/:productId - Delete product
router.delete('/:productId', deleteProduct);

module.exports = router;
