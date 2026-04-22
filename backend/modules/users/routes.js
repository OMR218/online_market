// Users Routes
const express = require('express');
const router = express.Router();
const { getAllCustomers, getCustomerById, createCustomer, updateCustomer, loginCustomer } = require('./controller');

// GET /users - Get all customers
router.get('/', getAllCustomers);

// GET /users/:personId - Get customer by ID
router.get('/:personId', getCustomerById);

// POST /users - Create new customer
router.post('/', createCustomer);

// PUT /users/:personId - Update customer
router.put('/:personId', updateCustomer);

// POST /users/login - Login customer
router.post('/login', loginCustomer);

module.exports = router;
