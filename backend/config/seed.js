const pool = require('./database');

const sampleProducts = [
    {
        name: 'Laptop Dell XPS',
        description: 'High performance laptop',
        price: 1200.00,
        stock_quantity: 10,
        type: 'electronics'
    },
    {
        name: 'Wireless Mouse',
        description: 'Logitech wireless mouse',
        price: 25.99,
        stock_quantity: 50,
        type: 'electronics'
    },
    {
        name: 'Mechanical Keyboard',
        description: 'RGB mechanical keyboard',
        price: 75.00,
        stock_quantity: 30,
        type: 'electronics'
    },
    {
        name: 'Apple Laptop',
        description: 'MacBook Pro 16',
        price: 2500.00,
        stock_quantity: 5,
        type: 'electronics'
    },
    {
        name: 'USB-C Cable',
        description: '2m USB-C charging cable',
        price: 12.99,
        stock_quantity: 100,
        type: 'electronics'
    },
    {
        name: 'Organic Apples',
        description: 'Fresh red organic apples from local farm',
        price: 4.99,
        stock_quantity: 50,
        type: 'food'
    },
    {
        name: 'Almond Butter',
        description: 'Natural creamy almond butter, no added sugar',
        price: 12.99,
        stock_quantity: 30,
        type: 'food'
    },
    {
        name: 'Greek Yogurt',
        description: 'Plain Greek yogurt, rich in protein',
        price: 6.49,
        stock_quantity: 40,
        type: 'food'
    },
    {
        name: 'Whole Wheat Bread',
        description: 'Fresh baked whole wheat bread daily',
        price: 3.99,
        stock_quantity: 25,
        type: 'food'
    },
    {
        name: 'Free Range Eggs',
        description: 'Dozen free range brown eggs',
        price: 7.99,
        stock_quantity: 35,
        type: 'food'
    },
    {
        name: 'Cotton T-Shirt',
        description: 'Classic white 100% cotton comfortable t-shirt',
        price: 19.99,
        stock_quantity: 60,
        type: 'clothing'
    },
    {
        name: 'Blue Jeans',
        description: 'Classic fit blue denim jeans',
        price: 49.99,
        stock_quantity: 45,
        type: 'clothing'
    },
    {
        name: 'Running Shoes',
        description: 'Lightweight athletic running shoes with cushioning',
        price: 89.99,
        stock_quantity: 35,
        type: 'clothing'
    },
    {
        name: 'Winter Jacket',
        description: 'Warm waterproof winter jacket with insulation',
        price: 129.99,
        stock_quantity: 20,
        type: 'clothing'
    },
    {
        name: 'Summer Dress',
        description: 'Light floral print summer dress',
        price: 39.99,
        stock_quantity: 40,
        type: 'clothing'
    }
];

async function seedSampleCatalog() {
    const connection = await pool.getConnection();

    try {
        const [countRows] = await connection.query('SELECT COUNT(*) AS count FROM product');
        const productCount = Number(countRows[0]?.count || 0);

        if (productCount > 0) {
            return false;
        }

        for (const product of sampleProducts) {
            const [result] = await connection.query(
                'INSERT INTO product (name, stock_quantity, description, price) VALUES (?, ?, ?, ?)',
                [product.name, product.stock_quantity, product.description, product.price]
            );

            if (product.type === 'electronics') {
                await connection.query(
                    'INSERT INTO electronics (product_id, warranty, brand) VALUES (?, ?, ?)',
                    [result.insertId, 12, 'Generic']
                );
            } else if (product.type === 'food') {
                const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                await connection.query(
                    'INSERT INTO food (product_id, exp_date, storage_type) VALUES (?, ?, ?)',
                    [result.insertId, futureDate, 'Pantry']
                );
            } else if (product.type === 'clothing') {
                await connection.query(
                    'INSERT INTO clothing (product_id, size, material, color) VALUES (?, ?, ?, ?)',
                    [result.insertId, 'M', 'Cotton', 'Various']
                );
            }
        }

        return true;
    } finally {
        connection.release();
    }
}

module.exports = {
    seedSampleCatalog
};