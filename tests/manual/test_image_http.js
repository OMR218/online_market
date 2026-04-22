// Test adding product with image_url
const http = require('http');

const data = JSON.stringify({
    name: 'Laptop Pro',
    description: 'High performance laptop',
    price: 1299.99,
    stock_quantity: 3,
    type: 'electronics',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/products',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('Add response:', body);
        
        // Now fetch it back
        const getOpts = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/products',
            method: 'GET'
        };
        
        const getReq = http.request(getOpts, (getRes) => {
            let getBody = '';
            getRes.on('data', (chunk) => getBody += chunk);
            getRes.on('end', () => {
                const parsed = JSON.parse(getBody);
                const laptop = parsed.data.find(p => p.name === 'Laptop Pro');
                console.log('\nLaptop Pro in list:', JSON.stringify(laptop, null, 2));
                process.exit();
            });
        });
        getReq.end();
    });
});

req.write(data);
req.end();
