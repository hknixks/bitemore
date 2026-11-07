// Uses the REAL rate limiters (the other test files switch them off), so it runs in its own process.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');

process.env.SECRET = 'unit-test-secret';
process.env.NODE_ENV = 'test';

const fake = require('./helpers/fakeModels');
fake.install();
const app = require('../app');

let server;
let base;
before(() => new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
        base = `http://127.0.0.1:${server.address().port}/api/v1`;
        resolve();
    });
}));
after(() => new Promise((resolve) => server.close(resolve)));

const post = (route, ip, body = { email: 'nobody@test.com', password: 'x', otp: '123456' }) =>
    fetch(base + route, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
        body: JSON.stringify(body),
    });

test('login is limited to 20 attempts per client, then answers 429 with a JSON message', async () => {
    const ip = '10.0.0.1';
    for (let i = 1; i <= 20; i++) {
        const res = await post('/userLogin', ip);
        assert.equal(res.status, 404, `attempt ${i} should reach the handler`);
    }
    const blocked = await post('/userLogin', ip);
    assert.equal(blocked.status, 429);
    const body = await blocked.json();
    assert.equal(body.status, false);
    assert.match(body.message, /too many/i);
    assert.ok(blocked.headers.get('ratelimit') || blocked.headers.get('ratelimit-policy'), 'standard rate limit headers are sent');
});

test('the limit is per client address (behind the proxy), so one noisy visitor does not block everyone', async () => {
    const res = await post('/userLogin', '10.0.0.2');
    assert.equal(res.status, 404, 'a different client is unaffected by 10.0.0.1 being blocked');
});

test('reset-code endpoints have their own stricter limit of 10', async () => {
    const ip = '10.0.0.3';
    for (let i = 1; i <= 10; i++) {
        const res = await post('/userVerifyOTP', ip);
        assert.equal(res.status, 404, `attempt ${i} should reach the handler`);
    }
    assert.equal((await post('/userVerifyOTP', ip)).status, 429);
    assert.equal((await post('/userForgotPin', ip)).status, 429, 'all reset endpoints share the one budget');
    assert.equal((await post('/userLogin', ip)).status, 404, 'login has its own separate budget');
});

test('admin login and signup are limited too', async () => {
    const ip = '10.0.0.4';
    for (let i = 1; i <= 20; i++) await post('/adminLogin', ip);
    assert.equal((await post('/adminLogin', ip)).status, 429);
    assert.equal((await post('/adminSignup', ip)).status, 429, 'signup shares the auth budget');
});

test('the health check is never rate limited', async () => {
    for (let i = 0; i < 50; i++) {
        const res = await fetch(base.replace('/api/v1', '/health'), { headers: { 'x-forwarded-for': '10.0.0.5' } });
        assert.equal(res.status, 200);
    }
});
