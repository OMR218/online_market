// Database Configuration
// Connect to MySQL using mysql2

const mysql = require('mysql2/promise');
const { execSync } = require('child_process');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

function getWslGatewayIp() {
    try {
        const output = execSync("ip route | awk '/default/ {print $3; exit}'", {
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore']
        }).trim();
        return output || null;
    } catch {
        return null;
    }
}

function getResolvNameserverIp() {
    try {
        const output = execSync("awk '/^nameserver/ {print $2; exit}' /etc/resolv.conf", {
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore']
        }).trim();
        return output || null;
    } catch {
        return null;
    }
}

function buildHostCandidates() {
    const candidates = [];
    const envHost = process.env.DB_HOST;
    const wslGateway = getWslGatewayIp();
    const resolvNameserver = getResolvNameserverIp();

    if (envHost) candidates.push(envHost);
    if (wslGateway) candidates.push(wslGateway);
    if (resolvNameserver) candidates.push(resolvNameserver);
    candidates.push('localhost');
    candidates.push('127.0.0.1');

    return [...new Set(candidates.filter(Boolean))];
}

function createPoolForHost(host) {
    return mysql.createPool({
        host,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'ecommerce',
        port: Number(process.env.DB_PORT || 3306),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
}

let activePool = null;
let activeHost = null;

async function getActivePool() {
    if (activePool) return activePool;

    const hosts = buildHostCandidates();
    let lastError = null;

    for (const host of hosts) {
        const pool = createPoolForHost(host);
        try {
            const connection = await pool.getConnection();
            connection.release();
            activePool = pool;
            activeHost = host;
            console.log(`✅ Database connected on ${host}:${process.env.DB_PORT || 3306}`);
            return activePool;
        } catch (error) {
            lastError = error;
            await pool.end().catch(() => {});
        }
    }

    throw lastError;
}

async function reconnectAndGetPool() {
    if (activePool) {
        await activePool.end().catch(() => {});
    }
    activePool = null;
    activeHost = null;
    return getActivePool();
}

const pool = {
    async getConnection() {
        try {
            const p = await getActivePool();
            return p.getConnection();
        } catch (error) {
            if (['ECONNREFUSED', 'ETIMEDOUT', 'PROTOCOL_CONNECTION_LOST'].includes(error.code)) {
                const p = await reconnectAndGetPool();
                return p.getConnection();
            }
            throw error;
        }
    },
    async query(sql, values) {
        try {
            const p = await getActivePool();
            return p.query(sql, values);
        } catch (error) {
            if (['ECONNREFUSED', 'ETIMEDOUT', 'PROTOCOL_CONNECTION_LOST'].includes(error.code)) {
                console.warn(`⚠️ Lost DB connection on ${activeHost || 'unknown host'}, retrying with fallback hosts...`);
                const p = await reconnectAndGetPool();
                return p.query(sql, values);
            }
            throw error;
        }
    }
};

module.exports = pool;
