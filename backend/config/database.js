// Database configuration
// PostgreSQL adapter with mysql2-like response shape used by existing controllers.

const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const INSERT_ID_COLUMNS = {
    person: 'person_id',
    phone: 'phone_id',
    address: 'address_id',
    product: 'product_id',
    cart: 'cart_id',
    cart_item: 'cart_item_id',
    orders: 'order_id',
    order_item: 'order_item_id',
    payment: 'payment_id',
    delivery: 'delivery_id'
};

function normalizeSql(sql) {
    let text = String(sql).trim();
    if (/^insert\s+ignore\s+/i.test(text)) {
        text = text.replace(/^insert\s+ignore\s+/i, 'INSERT ');
        text += ' ON CONFLICT DO NOTHING';
    }
    return text;
}

function toPgPlaceholders(sql) {
    let index = 0;
    return sql.replace(/\?/g, () => {
        index += 1;
        return `$${index}`;
    });
}

function withReturningInsertId(sql) {
    const match = sql.match(/^insert\s+into\s+([a-zA-Z_][a-zA-Z0-9_]*)/i);
    if (!match || /\breturning\b/i.test(sql)) {
        return { sql, insertIdColumn: null };
    }

    const table = match[1].toLowerCase();
    const insertIdColumn = INSERT_ID_COLUMNS[table] || null;
    if (!insertIdColumn) {
        return { sql, insertIdColumn: null };
    }

    return {
        sql: `${sql} RETURNING ${insertIdColumn}`,
        insertIdColumn
    };
}

function formatResult(result, insertIdColumn) {
    const rows = result.rows || [];
    const insertId = insertIdColumn && rows[0] ? rows[0][insertIdColumn] : undefined;
    return [rows, { insertId, affectedRows: result.rowCount || 0 }];
}

const pool = new Pool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'ecommerce',
    port: Number(process.env.DB_PORT || 5432),
    max: 10
});

class DbConnection {
    constructor(client) {
        this.client = client;
    }

    async query(sql, values = []) {
        const normalizedSql = normalizeSql(sql);
        const convertedSql = toPgPlaceholders(normalizedSql);
        const { sql: finalSql, insertIdColumn } = withReturningInsertId(convertedSql);
        const result = await this.client.query(finalSql, values);
        return formatResult(result, insertIdColumn);
    }

    async beginTransaction() {
        await this.client.query('BEGIN');
    }

    async commit() {
        await this.client.query('COMMIT');
    }

    async rollback() {
        await this.client.query('ROLLBACK');
    }

    release() {
        this.client.release();
    }
}

module.exports = {
    async getConnection() {
        const client = await pool.connect();
        return new DbConnection(client);
    },

    async query(sql, values = []) {
        const normalizedSql = normalizeSql(sql);
        const convertedSql = toPgPlaceholders(normalizedSql);
        const { sql: finalSql, insertIdColumn } = withReturningInsertId(convertedSql);
        const result = await pool.query(finalSql, values);
        return formatResult(result, insertIdColumn);
    }
};
