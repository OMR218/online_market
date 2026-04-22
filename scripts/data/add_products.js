// Add Food and Clothing products via API
const API = 'http://localhost:3000/api';

const foods = [
    { name: 'Organic Apples', description: 'Fresh red organic apples from local farm', price: 4.99, stock_quantity: 50, type: 'food' },
    { name: 'Almond Butter', description: 'Natural creamy almond butter, no added sugar', price: 12.99, stock_quantity: 30, type: 'food' },
    { name: 'Greek Yogurt', description: 'Plain Greek yogurt, rich in protein', price: 6.49, stock_quantity: 40, type: 'food' },
    { name: 'Whole Wheat Bread', description: 'Fresh baked whole wheat bread daily', price: 3.99, stock_quantity: 25, type: 'food' },
    { name: 'Free Range Eggs', description: 'Dozen free range brown eggs', price: 7.99, stock_quantity: 35, type: 'food' }
];

const clothing = [
    { name: 'Cotton T-Shirt', description: 'Classic white 100% cotton comfortable t-shirt', price: 19.99, stock_quantity: 60, type: 'clothing' },
    { name: 'Blue Jeans', description: 'Classic fit blue denim jeans', price: 49.99, stock_quantity: 45, type: 'clothing' },
    { name: 'Running Shoes', description: 'Lightweight athletic running shoes with cushioning', price: 89.99, stock_quantity: 35, type: 'clothing' },
    { name: 'Winter Jacket', description: 'Warm waterproof winter jacket with insulation', price: 129.99, stock_quantity: 20, type: 'clothing' },
    { name: 'Summer Dress', description: 'Light floral print summer dress', price: 39.99, stock_quantity: 40, type: 'clothing' }
];

async function addProducts() {
    const allProducts = [...foods, ...clothing];
    for (const product of allProducts) {
        try {
            const res = await fetch(`${API}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            const data = await res.json();
            console.log(`✅ Added: ${product.name}`);
        } catch (err) {
            console.error(`❌ Failed: ${product.name}`, err.message);
        }
    }
    console.log('\n✅ All products added!');
}

addProducts();
