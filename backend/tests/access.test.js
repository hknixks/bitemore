const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const h = require('./helpers/harness');

let api;
before(async () => { api = await h.start(); });
after(async () => { await api.close(); });
beforeEach(() => { h.fake.resetAll(); h.paystack.reset(); });

const PROTECTED_USER_ROUTES = [
    ['GET', '/userAuthorization'],
    ['PATCH', '/updateUserProfile/abc'],
    ['PATCH', '/password/abc'],
    ['POST', '/userCart'],
    ['GET', '/getUserCart/abc'],
    ['DELETE', '/deleteUserItem/abc'],
    ['PUT', '/cart/increaseQuantity/abc'],
    ['PUT', '/cart/decreaseQuantity/abc'],
    ['POST', '/makingPayment'],
    ['GET', '/getUserHistory/abc'],
];

const PROTECTED_ADMIN_ROUTES = [
    ['GET', '/adminAuthorization'],
    ['POST', '/adminUpload'],
    ['DELETE', '/removeFood/abc'],
    ['GET', '/getNewOrder'],
    ['GET', '/getAllUserHistory'],
    ['POST', '/acceptOffer'],
    ['POST', '/declineOffer'],
];

test('every protected route rejects requests with no token', async () => {
    for (const [method, route] of [...PROTECTED_USER_ROUTES, ...PROTECTED_ADMIN_ROUTES]) {
        const res = await api.call(method, route);
        assert.equal(res.status, 401, `${method} ${route} should be 401 without a token, got ${res.status}`);
    }
});

test('a customer token cannot use any admin route', async () => {
    const { token } = await h.signupAndLogin(api.call, { email: 'cust@test.com' });
    for (const [method, route] of PROTECTED_ADMIN_ROUTES) {
        const res = await api.call(method, route, { token });
        assert.equal(res.status, 403, `${method} ${route} should be 403 for a customer, got ${res.status}`);
    }
});

test('an admin token cannot use customer routes', async () => {
    const token = await h.adminLoginToken(api.call);
    for (const [method, route] of PROTECTED_USER_ROUTES) {
        const res = await api.call(method, route, { token });
        assert.equal(res.status, 403, `${method} ${route} should be 403 for an admin, got ${res.status}`);
    }
});

test('forged, expired, unsigned and role-less tokens are rejected', async () => {
    const { user } = await h.signupAndLogin(api.call, { email: 'cust@test.com' });
    const payload = { id: user._id, email: user.email, role: 'user' };

    const wrongSecret = jwt.sign(payload, 'not-the-secret');
    const expired = jwt.sign(payload, process.env.SECRET, { expiresIn: -10 });
    const unsigned = jwt.sign(payload, '', { algorithm: 'none' });
    // What the old code issued: just an email, no role or id.
    const legacy = jwt.sign({ email: user.email }, process.env.SECRET);

    assert.equal((await api.call('GET', '/userAuthorization', { token: wrongSecret })).status, 401);
    assert.equal((await api.call('GET', '/userAuthorization', { token: expired })).status, 401);
    assert.equal((await api.call('GET', '/userAuthorization', { token: unsigned })).status, 401);
    assert.equal((await api.call('GET', '/userAuthorization', { token: legacy })).status, 403);
    assert.equal((await api.call('GET', '/userAuthorization', { token: 'garbage' })).status, 401);
});

test('a token for a deleted account stops working', async () => {
    const { token, user } = await h.signupAndLogin(api.call, { email: 'gone@test.com' });
    h.fake.models.user.store.splice(0, h.fake.models.user.store.length);
    const res = await api.call('GET', '/userAuthorization', { token });
    assert.equal(res.status, 401, `account ${user._id} no longer exists`);
});

test('the menu stays public', async () => {
    await h.addFood('Jollof', 2500);
    const res = await api.call('GET', '/api');
    assert.equal(res.body.status, true);
    assert.equal(res.body.data.length, 1);
});

test('login and authorization never expose password, hash or reset data', async () => {
    const { token, user } = await h.signupAndLogin(api.call, { email: 'cust@test.com' });
    const stored = h.fake.models.user.store[0];
    stored.otpHash = 'abc123';
    stored.otpExpires = new Date();

    for (const forbidden of ['password', 'otp', 'otpHash', 'otpExpires', 'otpAttempts']) {
        assert.equal(forbidden in user, false, `login response leaked ${forbidden}`);
    }
    const me = await api.call('GET', '/userAuthorization', { token });
    assert.equal(me.status, 200);
    for (const forbidden of ['password', 'otp', 'otpHash', 'otpExpires', 'otpAttempts']) {
        assert.equal(forbidden in me.body.user, false, `authorization response leaked ${forbidden}`);
    }
    assert.equal(me.body.user.email, 'cust@test.com');
});

test('the saved password is hashed exactly once even after later saves', async () => {
    await h.signupAndLogin(api.call, { email: 'cust@test.com', password: 'secret123' });
    const stored = h.fake.models.user.store[0];
    assert.match(stored.password, /^\$2[aby]\$/);
    const before = stored.password;
    await stored.save();
    assert.equal(stored.password, before);
});

test('login rejects object-shaped credentials (NoSQL injection attempt)', async () => {
    await h.signupAndLogin(api.call, { email: 'cust@test.com' });
    const res = await api.call('POST', '/userLogin', { body: { email: { $ne: null }, password: { $ne: null } } });
    assert.equal(res.status, 400);
    assert.equal(res.body.token, undefined);
});

test('wrong password and unknown user still fail', async () => {
    await h.signupAndLogin(api.call, { email: 'cust@test.com' });
    const wrong = await api.call('POST', '/userLogin', { body: { email: 'cust@test.com', password: 'nope' } });
    assert.equal(wrong.body.status, false);
    assert.equal(wrong.body.token, undefined);
    const unknown = await api.call('POST', '/userLogin', { body: { email: 'x@test.com', password: 'nope' } });
    assert.equal(unknown.status, 404);
});

test('signup validates input and refuses duplicates', async () => {
    const good = { firstname: 'A', lastname: 'B', email: 'a@test.com', password: 'secret123', phonenumber: '080' };
    assert.equal((await api.call('POST', '/userSignup', { body: { ...good, password: '123' } })).status, 400);
    assert.equal((await api.call('POST', '/userSignup', { body: { ...good, email: 'not-an-email' } })).status, 400);
    assert.equal((await api.call('POST', '/userSignup', { body: good })).status, 200);
    assert.equal((await api.call('POST', '/userSignup', { body: good })).status, 409);
});

test('admin signup: disabled without a configured code, and the old "ADMIN" token no longer works', async () => {
    const body = { firstname: 'A', lastname: 'B', email: 'a@test.com', password: 'secret123', phonenumber: '080', adminToken: 'ADMIN' };

    delete process.env.ADMIN_SIGNUP_CODE;
    assert.equal((await api.call('POST', '/adminSignup', { body })).status, 403, 'disabled when no code is configured');

    process.env.ADMIN_SIGNUP_CODE = 'a-real-secret';
    assert.equal((await api.call('POST', '/adminSignup', { body })).status, 403, 'the hardcoded ADMIN token must be refused');
    assert.equal((await api.call('POST', '/adminSignup', { body: { ...body, adminToken: 'a-real-secret' } })).status, 200);
    assert.equal(h.fake.models.admin.store.length, 1);
    assert.equal('adminToken' in h.fake.models.admin.store[0], false, 'the signup code is never stored');
});

test('profile and password changes apply to the token owner, not the id in the URL', async () => {
    const alice = await h.signupAndLogin(api.call, { email: 'alice@test.com', firstname: 'Alice' });
    const bob = await h.signupAndLogin(api.call, { email: 'bob@test.com', firstname: 'Bob', password: 'bobpass99' });

    // Alice tries to edit and re-password Bob by putting his id in the URL.
    const edit = await api.call('PATCH', `/updateUserProfile/${bob.user._id}`, { token: alice.token, body: { firstname: 'Hacked' } });
    assert.equal(edit.status, 201);
    assert.equal(edit.body.data.firstname, 'Hacked');
    assert.equal('password' in edit.body.data, false);

    const pw = await api.call('PATCH', `/password/${bob.user._id}`, { token: alice.token, body: { password: 'alicenew1' } });
    assert.equal(pw.status, 201);

    const users = h.fake.models.user.store;
    const bobDoc = users.find((u) => u.email === 'bob@test.com');
    const aliceDoc = users.find((u) => u.email === 'alice@test.com');
    assert.equal(bobDoc.firstname, 'Bob', "Bob's profile must be untouched");
    assert.equal(aliceDoc.firstname, 'Hacked');

    const bobLogin = await api.call('POST', '/userLogin', { body: { email: 'bob@test.com', password: 'bobpass99' } });
    assert.equal(bobLogin.body.status, true, "Bob's password must be untouched");
    const aliceLogin = await api.call('POST', '/userLogin', { body: { email: 'alice@test.com', password: 'alicenew1' } });
    assert.equal(aliceLogin.body.status, true);
});

test('profile update works without a new picture and rejects a bad email', async () => {
    const { token } = await h.signupAndLogin(api.call, { email: 'cust@test.com' });
    const ok = await api.call('PATCH', '/updateUserProfile/x', { token, body: { phonenumber: '09099999999' } });
    assert.equal(ok.status, 201);
    const bad = await api.call('PATCH', '/updateUserProfile/x', { token, body: { email: 'nope' } });
    assert.equal(bad.status, 400);
    const short = await api.call('PATCH', '/password/x', { token, body: { password: '1' } });
    assert.equal(short.status, 400);
});

test('admin upload validates input before touching storage', async () => {
    const token = await h.adminLoginToken(api.call);
    const badPrice = await api.call('POST', '/adminUpload', { token, body: { name: 'Rice', description: 'd', price: -5 } });
    assert.equal(badPrice.status, 400);
    const noFile = await api.call('POST', '/adminUpload', { token, body: { name: 'Rice', description: 'd', price: 1000 } });
    assert.equal(noFile.status, 400);
    assert.match(noFile.body.message, /image/i);
});

test('admin can remove food; bad ids are rejected cleanly', async () => {
    const token = await h.adminLoginToken(api.call);
    const food = await h.addFood('Suya', 3000);
    assert.equal((await api.call('DELETE', '/removeFood/not-an-id', { token })).status, 400);
    assert.equal((await api.call('DELETE', `/removeFood/${food._id}`, { token })).status, 201);
    assert.equal(h.fake.models.food.store.length, 0);
});

test('security headers are set and CORS only allows known sites', async () => {
    const health = await api.raw('/health');
    assert.equal(health.status, 200);
    assert.ok(health.headers.get('x-content-type-options'), 'helmet headers present');
    assert.equal(health.headers.get('x-powered-by'), null, 'express fingerprint hidden');

    const allowed = await api.raw('/health', { headers: { origin: 'https://bitemore-chi.vercel.app' } });
    assert.equal(allowed.headers.get('access-control-allow-origin'), 'https://bitemore-chi.vercel.app');

    const evil = await api.raw('/health', { headers: { origin: 'https://evil.example' } });
    assert.equal(evil.headers.get('access-control-allow-origin'), null);
});

test('malformed JSON gets a clean 400, not a stack trace', async () => {
    const res = await api.raw('/api/v1/userLogin', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"email": ' });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.status, false);
    assert.equal(JSON.stringify(body).includes('node_modules'), false);
});
