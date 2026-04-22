// Express app configuration
const express = require('express');
const cors = require('cors');

// Import routes
const productRoutes = require('./modules/products/routes');
const cartRoutes = require('./modules/cart/routes');
const orderRoutes = require('./modules/orders/routes');
const userRoutes = require('./modules/users/routes');

// Create app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Public info endpoint for quick verification
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'E-Commerce API is running',
        data: {
            health: '/api/health',
            products: '/api/products'
        }
    });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running'
    });
});

// Alias for simpler manual checks
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

module.exports = app;
