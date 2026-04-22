// Test adding product with image_url
(async() => {
    try {
        const response = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Product With Image',
                description: 'Testing image URL support',
                price: 49.99,
                stock_quantity: 5,
                type: 'electronics',
                image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'
            })
        });
        
        const data = await response.json();
        console.log('Add response:', JSON.stringify(data, null, 2));
        
        // Now fetch all products to see if it appears
        const getAllResponse = await fetch('http://localhost:3000/api/products');
        const allData = await getAllResponse.json();
        const newProduct = allData.data.find(p => p.name === 'Test Product With Image');
        console.log('\nProduct in list:', JSON.stringify(newProduct, null, 2));
        
        process.exit();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
})();
