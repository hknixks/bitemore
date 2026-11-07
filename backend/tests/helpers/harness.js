// Boots the real Express app on a random port with fakes for the database, Paystack and email.
const path = require('path');
const nodemailer = require('nodemailer');

process.env.SECRET = 'unit-test-secret';
process.env.PAYSTACK_SECRET_KEY = 'sk_test_unit';
process.env.NODE_ENV = 'test';

const realFetch = global.fetch;

// ---- Paystack stub (only api.paystack.co calls are intercepted) ----
const paystack = { calls: [], respond: null, networkError: false };

global.fetch = async (url, options) => {
    if (String(url).startsWith('https://api.paystack.co/')) {
        paystack.calls.push({ url: String(url), options });
        if (paystack.networkError) throw new Error('network down');
        return paystack.respond(String(url));
    }
    return realFetch(url, options);
};

const reply = (body, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => body });

paystack.succeed = (amountKobo, extra = {}) => {
    paystack.respond = () => reply({
        status: true,
        data: { status: 'success', amount: amountKobo, currency: 'NGN', id: 4242, ...extra },
    });
};
paystack.fail = (txStatus = 'abandoned') => {
    paystack.respond = () => reply({ status: true, data: { status: txStatus, amount: 0, currency: 'NGN' } });
};
paystack.reset = () => {
    paystack.calls = [];
    paystack.networkError = false;
    paystack.fail();
};

// ---- Email stub: captures the message instead of sending it ----
const sentMail = [];
nodemailer.createTransport = () => ({
    sendMail: async (message) => { sentMail.push(message); return { messageId: 'test' }; },
});

const latestOtpFor = (email) => {
    const message = [...sentMail].reverse().find((m) => m.to === email);
    if (!message) return null;
    const match = message.html.match(/class="otp">(\d{6})</);
    return match ? match[1] : null;
};

// ---- Database fakes ----
const fake = require('./fakeModels');
fake.install();

// Rate limiting has its own test file; here it is switched off so repeated logins do not trip it.
const limiterPath = require.resolve(path.join(__dirname, '../../middleware/rateLimiters'));
const passThrough = (req, res, next) => next();
require.cache[limiterPath] = {
    id: limiterPath, filename: limiterPath, loaded: true, children: [], paths: [],
    exports: { apiLimiter: passThrough, authLimiter: passThrough, otpLimiter: passThrough },
};

const app = require('../../app');

const start = () => new Promise((resolve) => {
    const server = app.listen(0, '127.0.0.1', () => {
        const base = `http://127.0.0.1:${server.address().port}`;

        const call = async (method, route, { token, body, headers } = {}) => {
            const response = await realFetch(`${base}/api/v1${route}`, {
                method,
                headers: {
                    'content-type': 'application/json',
                    ...(token ? { authorization: `Bearer ${token}` } : {}),
                    ...(headers || {}),
                },
                body: body === undefined ? undefined : JSON.stringify(body),
            });
            let json = null;
            try { json = await response.json(); } catch (error) { json = null; }
            return { status: response.status, body: json, headers: response.headers };
        };

        const raw = (route, options) => realFetch(`${base}${route}`, options);

        resolve({ server, call, raw, close: () => new Promise((done) => server.close(done)) });
    });
});

// ---- Helpers for building scenarios ----
const signupAndLogin = async (call, { email, password = 'secret123', firstname = 'Ada', lastname = 'Obi' }) => {
    await call('POST', '/userSignup', { body: { firstname, lastname, email, password, phonenumber: '08012345678' } });
    const login = await call('POST', '/userLogin', { body: { email, password } });
    return { token: login.body.token, user: login.body.user, password };
};

const adminLoginToken = async (call, email = 'boss@bitemore.test') => {
    process.env.ADMIN_SIGNUP_CODE = 'let-me-in';
    await call('POST', '/adminSignup', {
        body: { firstname: 'Boss', lastname: 'Admin', email, password: 'adminpass1', phonenumber: '08000000000', adminToken: 'let-me-in' },
    });
    const login = await call('POST', '/adminLogin', { body: { email, password: 'adminpass1' } });
    return login.body.token;
};

const addFood = async (name, price) => {
    const food = new fake.models.food({ name, price, description: `${name} description`, profileImage: `https://img.test/${name}.jpg` });
    await food.save();
    return food;
};

module.exports = { start, fake, paystack, sentMail, latestOtpFor, signupAndLogin, adminLoginToken, addFood };
