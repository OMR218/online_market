// Server entry point
const app = require('./app');
const { seedSampleCatalog } = require('./config/seed');

const BASE_PORT = Number(process.env.PORT || 3000);
const MAX_RETRIES = 10;

async function startServer(port, retriesLeft) {
    try {
        const seeded = await seedSampleCatalog();
        if (seeded) {
            console.log('✅ Sample catalog seeded automatically');
        }
    } catch (error) {
        console.warn('⚠️ Seed skipped or failed:', error.message);
    }

    const server = app.listen(port, () => {
        console.log(`✅ Server is running on http://localhost:${port}`);
        console.log(`📡 API Health: http://localhost:${port}/api/health`);
        console.log(`📦 Products: http://localhost:${port}/api/products`);
    });

    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE' && retriesLeft > 0) {
            const nextPort = port + 1;
            console.warn(`⚠️ Port ${port} is in use, trying ${nextPort}...`);
            startServer(nextPort, retriesLeft - 1);
            return;
        }

        if (error.code === 'EADDRINUSE') {
            console.error(`❌ Could not find a free port after trying ${MAX_RETRIES + 1} ports starting from ${BASE_PORT}.`);
        } else {
            console.error('❌ Server failed to start:', error.message);
        }
        process.exit(1);
    });
}

startServer(BASE_PORT, MAX_RETRIES);
