// Test creating product with image via API
const API = 'http://localhost:3000/api';

async function test() {
    try {
        const res = await fetch(`${API}/products`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: 'Test Product Direct',
                description: 'Direct test',
                price: 99.99,
                stock_quantity: 10,
                type: 'electronics',
                image_url: 'https://direct-test-image.com/image.jpg'
            })
        });
        const data = await res.json();
        console.log('Create response:', data);
        
        if (data.productId) {
            const getRes = await fetch(`${API}/products/${data.productId}`);
            const product = await getRes.json();
            console.log('\nRetrieved product:', JSON.stringify(product.data, null, 2));
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
    process.exit();
}

test();
