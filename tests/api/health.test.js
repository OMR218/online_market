const test = require('node:test');
const assert = require('node:assert/strict');

const API_BASE = process.env.API_BASE || 'http://localhost:3000/api';

async function getJson(url) {
  const response = await fetch(url);
  const body = await response.json().catch(() => ({}));
  return { response, body };
}

test('health endpoint returns success', async (t) => {
  try {
    const { response, body } = await getJson(`${API_BASE}/health`);
    assert.equal(response.status, 200, `Expected 200, got ${response.status}`);
    assert.equal(body.success, true);
  } catch (error) {
    if (error?.cause?.code === 'ECONNREFUSED') {
      t.skip(`Backend is not running on ${API_BASE}`);
      return;
    }
    throw error;
  }
});
