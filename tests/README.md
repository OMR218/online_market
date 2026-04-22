# Tests

This folder contains API and manual test scripts.

## Structure

- tests/api: automated Node test runner tests (*.test.js)
- tests/manual: manual scripts for ad-hoc checks

## Run automated tests

From repository root:

npm test

or

npm run test:api

Note: backend server must be running at http://localhost:3000 by default.
You can override API URL with API_BASE, for example:

API_BASE=http://localhost:3001/api npm run test:api
