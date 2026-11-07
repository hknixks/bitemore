const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const h = require('./helpers/harness');

let api;
before(async () => { api = await h.start(); });
after(async () => { await api.close(); });
beforeEach(() => { h.fake.resetAll(); h.paystack.reset(); h.sentMail.length = 0; });

const { models } = h.fake;
const userDoc = (email) => models.user.store.find((u) => u.email === email);
const loginWorks = async (email, password) => (await api.call('POST', '/userLogin', { body: { email, password } })).body.status === true;

const request = (email) => api.call('POST', '/userResetpassword', { body: { email } });
const verify = (email, otp) => api.call('POST', '/userVerifyOTP', { body: { email, otp } });
const reset = (body) => api.call('POST', '/userForgotPin', { body });

test('the original hole is closed: resetting with just an email and a new password does nothing', async () => {
    await h.signupAndLogin(api.call, { email: 'victim@test.com', password: 'victimpass' });

    for (const route of ['/userForgotPin', '/forgotPin']) {
        const res = await api.call('POST', route, { body: { email: 'victim@test.com', newPassword: 'attacker99' } });
        assert.equal(res.status, 400, `${route} must require a code`);
    }
    assert.equal(await loginWorks('victim@test.com', 'victimpass'), true);
    assert.equal(await loginWorks('victim@test.com', 'attacker99'), false);
});

test('requesting a code emails a 6-digit number and stores only a hash of it', async () => {
    await h.signupAndLogin(api.call, { email: 'a@test.com' });
    const res = await request('a@test.com');
    assert.equal(res.status, 200);

    const otp = h.latestOtpFor('a@test.com');
    assert.match(otp, /^\d{6}$/);
    assert.match(h.sentMail[0].html, /10 minutes/);

    const doc = userDoc('a@test.com');
    assert.ok(doc.otpHash, 'a hash is stored');
    assert.equal(doc.otpHash.includes(otp), false, 'the code itself is not stored');
    assert.equal('otp' in doc, false, 'no plaintext otp field');
    const ttl = doc.otpExpires.getTime() - Date.now();
    assert.ok(ttl > 9 * 60 * 1000 && ttl <= 10 * 60 * 1000, `expires in about 10 minutes, got ${ttl}ms`);
});

test('codes look random: 200 requests give 6 digits each with no obvious repeats', async () => {
    await h.signupAndLogin(api.call, { email: 'a@test.com' });
    const seen = new Set();
    for (let i = 0; i < 200; i++) {
        // Skip the 1-minute resend cooldown by backdating the previous code.
        userDoc('a@test.com').otpExpires = new Date(Date.now() - 1);
        await request('a@test.com');
        const otp = h.latestOtpFor('a@test.com');
        assert.match(otp, /^[1-9]\d{5}$/);
        seen.add(otp);
    }
    assert.ok(seen.size > 190, `expected mostly unique codes, got ${seen.size}/200`);
});

test('unknown email and missing email are handled', async () => {
    assert.equal((await request('nobody@test.com')).status, 404);
    assert.equal((await api.call('POST', '/userResetpassword', { body: {} })).status, 400);
    assert.equal((await api.call('POST', '/userResetpassword', { body: { email: { $ne: null } } })).status, 400);
    assert.equal(h.sentMail.length, 0);
});

test('requesting codes in a loop is throttled per account', async () => {
    await h.signupAndLogin(api.call, { email: 'a@test.com' });
    assert.equal((await request('a@test.com')).status, 200);
    const second = await request('a@test.com');
    assert.equal(second.status, 429);
    assert.equal(h.sentMail.length, 1, 'no second email is sent');
});

test('full happy path: request, verify, reset, then the new password works and the code is spent', async () => {
    await h.signupAndLogin(api.call, { email: 'a@test.com', password: 'oldpass123' });
    await request('a@test.com');
    const otp = h.latestOtpFor('a@test.com');

    const checked = await verify('a@test.com', otp);
    assert.equal(checked.status, 200);
    assert.equal(checked.body.status, true);
    assert.ok(userDoc('a@test.com').otpHash, 'verifying alone does not use the code up');

    const done = await reset({ email: 'a@test.com', otp, newPassword: 'brandnew456' });
    assert.equal(done.status, 200);
    assert.equal(await loginWorks('a@test.com', 'brandnew456'), true);
    assert.equal(await loginWorks('a@test.com', 'oldpass123'), false);
    assert.equal(userDoc('a@test.com').otpHash, undefined);

    const replay = await reset({ email: 'a@test.com', otp, newPassword: 'again789' });
    assert.equal(replay.status, 400, 'the same code cannot be used twice');
    assert.equal(await loginWorks('a@test.com', 'brandnew456'), true);
});

test('a wrong code is refused and leaves the password alone', async () => {
    await h.signupAndLogin(api.call, { email: 'a@test.com', password: 'oldpass123' });
    await request('a@test.com');
    const otp = h.latestOtpFor('a@test.com');
    const wrong = otp === '123456' ? '654321' : '123456';

    assert.equal((await verify('a@test.com', wrong)).status, 401);
    assert.equal((await reset({ email: 'a@test.com', otp: wrong, newPassword: 'attacker99' })).status, 401);
    for (const bad of ['', 'abcdef', '12345', '1234567', null, { $ne: null }]) {
        const res = await reset({ email: 'a@test.com', otp: bad, newPassword: 'attacker99' });
        assert.ok(res.status === 400 || res.status === 401, `otp ${JSON.stringify(bad)} gave ${res.status}`);
    }
    assert.equal(await loginWorks('a@test.com', 'oldpass123'), true);
});

test('after 5 wrong guesses the code is thrown away, even the right one stops working', async () => {
    await h.signupAndLogin(api.call, { email: 'a@test.com', password: 'oldpass123' });
    await request('a@test.com');
    const otp = h.latestOtpFor('a@test.com');
    const wrong = otp === '111111' ? '222222' : '111111';

    for (let i = 0; i < 5; i++) {
        assert.equal((await verify('a@test.com', wrong)).status, 401);
    }
    const sixth = await verify('a@test.com', wrong);
    assert.equal(sixth.status, 429);

    const right = await reset({ email: 'a@test.com', otp, newPassword: 'attacker99' });
    assert.equal(right.status, 400, 'the code was discarded, so a brute-forcer gains nothing by guessing right later');
    assert.equal(await loginWorks('a@test.com', 'oldpass123'), true);
});

test('an expired code is refused', async () => {
    await h.signupAndLogin(api.call, { email: 'a@test.com', password: 'oldpass123' });
    await request('a@test.com');
    const otp = h.latestOtpFor('a@test.com');
    userDoc('a@test.com').otpExpires = new Date(Date.now() - 1000);

    const res = await reset({ email: 'a@test.com', otp, newPassword: 'late12345' });
    assert.equal(res.status, 401);
    assert.match(res.body.message, /expired/i);
    assert.equal(await loginWorks('a@test.com', 'oldpass123'), true);
});

test("one account's code cannot reset another account", async () => {
    await h.signupAndLogin(api.call, { email: 'mine@test.com', password: 'mine12345' });
    await h.signupAndLogin(api.call, { email: 'target@test.com', password: 'target12345' });
    await request('mine@test.com');
    await request('target@test.com');
    const myOtp = h.latestOtpFor('mine@test.com');

    const noCode = await reset({ email: 'victim-without-code@test.com', otp: myOtp, newPassword: 'attacker99' });
    assert.equal(noCode.status, 404);
    const res = await reset({ email: 'target@test.com', otp: myOtp, newPassword: 'attacker99' });
    assert.equal(res.status, 401);
    assert.equal(await loginWorks('target@test.com', 'target12345'), true);

    // Even if the stored hash were copied over, it is bound to the email it was issued for.
    userDoc('target@test.com').otpHash = userDoc('mine@test.com').otpHash;
    const copied = await reset({ email: 'target@test.com', otp: myOtp, newPassword: 'attacker99' });
    assert.equal(copied.status, 401);
});

test('new passwords must be long enough, and the code survives a too-short attempt', async () => {
    await h.signupAndLogin(api.call, { email: 'a@test.com' });
    await request('a@test.com');
    const otp = h.latestOtpFor('a@test.com');
    assert.equal((await reset({ email: 'a@test.com', otp, newPassword: '123' })).status, 400);
    assert.equal((await reset({ email: 'a@test.com', otp, newPassword: 'longenough1' })).status, 200);
});

test('if the email cannot be sent, no usable code is left behind', async () => {
    await h.signupAndLogin(api.call, { email: 'a@test.com' });
    // The stubbed transport records mail with sentMail.push; make that fail to simulate an SMTP outage.
    const original = h.sentMail.push;
    h.sentMail.push = () => { throw new Error('smtp down'); };
    try {
        const res = await request('a@test.com');
        assert.equal(res.status, 500);
    } finally {
        h.sentMail.push = original;
    }
    assert.equal(userDoc('a@test.com').otpHash, undefined);
});
