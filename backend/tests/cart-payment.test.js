const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const h = require('./helpers/harness');

let api;
before(async () => { api = await h.start(); });
after(async () => { await api.close(); });
beforeEach(() => { h.fake.resetAll(); h.paystack.reset(); });

const { models } = h.fake;

// Menu: 2 x Jollof (1500) + 1 x Suya (2000) = 5000 items, 2 lines x 800 = 1600 delivery, 6600 total.
const buildCart = async (token) => {
    const existing = (name) => models.food.store.find((food) => food.name === name);
    const jollof = existing('Jollof') || await h.addFood('Jollof', 1500);
    const suya = existing('Suya') || await h.addFood('Suya', 2000);
    await api.call('POST', '/userCart', { token, body: { item: { _id: String(jollof._id) }, quantity: 2 } });
    await api.call('POST', '/userCart', { token, body: { item: { _id: String(suya._id) }, quantity: 1 } });
    return { jollof, suya };
};

const delivery = { state: 'Lagos', city: 'Ikorodu', address: '12 Test Street', phoneNo: '08011112222', latitude: 6.6, longitude: 3.5, deliveryType: 'Home' };
const pay = (token, extra = {}) => api.call('POST', '/makingPayment', { token, body: { reference: 'REF-1', ...delivery, ...extra } });

// ---------------- cart ----------------

test('cart price, name and picture come from the menu, not from the browser', async () => {
    const { token } = await h.signupAndLogin(api.call, { email: 'a@test.com' });
    const food = await h.addFood('Jollof', 2500);

    const res = await api.call('POST', '/userCart', {
        token,
        body: { item: { _id: String(food._id), name: 'Hacked', price: 1, profileImage: 'x' }, quantity: 1, status: 'Paid', user: 'someone-else' },
    });
    assert.equal(res.status, 201);
    const row = models.cart.store[0];
    assert.equal(row.price, 2500);
    assert.equal(row.name, 'Jollof');
    assert.equal(row.status, 'Pending', 'client cannot choose the status');
    assert.equal(String(row.user), String(models.user.store[0]._id), 'the cart belongs to the logged-in user');
});

test('adding the same item again increases its quantity, up to a cap', async () => {
    const { token } = await h.signupAndLogin(api.call, { email: 'a@test.com' });
    const food = await h.addFood('Jollof', 1000);
    await api.call('POST', '/userCart', { token, body: { item: { _id: String(food._id) }, quantity: 30 } });
    const second = await api.call('POST', '/userCart', { token, body: { item: { _id: String(food._id) }, quantity: 30 } });
    assert.equal(second.status, 200);
    assert.equal(models.cart.store.length, 1);
    assert.equal(models.cart.store[0].quantity, 50);
});

test('bad cart input is rejected', async () => {
    const { token } = await h.signupAndLogin(api.call, { email: 'a@test.com' });
    const food = await h.addFood('Jollof', 1000);
    const id = String(food._id);
    for (const quantity of [0, -1, 1.5, 51, 9999, 'abc', null]) {
        const res = await api.call('POST', '/userCart', { token, body: { item: { _id: id }, quantity } });
        assert.equal(res.status, 400, `quantity ${JSON.stringify(quantity)} should be rejected`);
    }
    assert.equal((await api.call('POST', '/userCart', { token, body: { item: { _id: 'nope' }, quantity: 1 } })).status, 400);
    assert.equal((await api.call('POST', '/userCart', { token, body: { quantity: 1 } })).status, 400);
    const missing = await api.call('POST', '/userCart', { token, body: { item: { _id: '64b7f0f2a1b2c3d4e5f60718' }, quantity: 1 } });
    assert.equal(missing.status, 404);
    assert.equal(models.cart.store.length, 0);
});

test("one customer cannot read or change another customer's cart", async () => {
    const alice = await h.signupAndLogin(api.call, { email: 'alice@test.com' });
    const bob = await h.signupAndLogin(api.call, { email: 'bob@test.com' });
    await buildCart(alice.token);
    const aliceRow = models.cart.store[0];

    const read = await api.call('GET', `/getUserCart/${alice.user._id}`, { token: bob.token });
    assert.equal(read.status, 404, "Bob asking for Alice's id still only sees his own (empty) cart");

    const inc = await api.call('PUT', `/cart/increaseQuantity/${aliceRow._id}`, { token: bob.token, body: { quantity: 40 } });
    assert.equal(inc.status, 404);
    const del = await api.call('DELETE', `/deleteUserItem/${aliceRow._id}`, { token: bob.token });
    assert.equal(del.status, 404);
    assert.equal(models.cart.store.length, 2);
    assert.equal(aliceRow.quantity, 2);

    const own = await api.call('GET', `/getUserCart/${bob.user._id}`, { token: alice.token });
    assert.equal(own.body.data.length, 2, 'Alice gets her own cart whatever id is in the URL');

    const ok = await api.call('PUT', `/cart/increaseQuantity/${aliceRow._id}`, { token: alice.token, body: { quantity: 3 } });
    assert.equal(ok.status, 200);
    assert.equal(aliceRow.quantity, 3);
    assert.equal((await api.call('PUT', `/cart/decreaseQuantity/${aliceRow._id}`, { token: alice.token, body: { quantity: 0 } })).status, 400);
    assert.equal((await api.call('DELETE', `/deleteUserItem/${aliceRow._id}`, { token: alice.token })).status, 200);
});

// ---------------- payment ----------------

test('a confirmed payment creates the order with server-computed totals', async () => {
    const { token, user } = await h.signupAndLogin(api.call, { email: 'a@test.com' });
    await buildCart(token);
    h.paystack.succeed(660000);

    const res = await pay(token);
    assert.equal(res.status, 200, JSON.stringify(res.body));
    assert.equal(res.body.success, true);

    // Paystack was asked about this reference with the server's secret key.
    assert.equal(h.paystack.calls.length, 1);
    assert.ok(h.paystack.calls[0].url.endsWith('/transaction/verify/REF-1'));
    assert.equal(h.paystack.calls[0].options.headers.Authorization, 'Bearer sk_test_unit');

    assert.equal(models.payment.store.length, 1);
    const order = models.payment.store[0];
    assert.equal(order.status, 'Paid');
    assert.equal(order.amount, 5000);
    assert.equal(order.deliveryFee, 1600);
    assert.equal(order.totalFee, 6600);
    assert.equal(order.city, 'Ikorodu', 'city is now recorded');
    assert.equal(order.user._id, String(user._id));
    assert.equal(order.user.firstname, 'Ada');
    assert.equal('password' in order.user, false, 'no password hash is copied into orders');
    assert.equal(order.cart.length, 2);
    assert.ok(order.cart.every((line) => line.status === 'Paid' && line.name && line.quantity));

    assert.ok(models.cart.store.every((row) => row.status === 'Paid'), 'cart rows are marked paid');
});

test('totals, prices and cart contents sent by the browser are ignored', async () => {
    const { token } = await h.signupAndLogin(api.call, { email: 'a@test.com' });
    await buildCart(token);
    h.paystack.succeed(660000);

    const res = await pay(token, {
        amount: 1, deliveryFee: 0, totalFee: 1, status: 'Delivered',
        cart: [{ _id: 'fake', name: 'Free lunch', price: 0, quantity: 99 }],
        user: { _id: 'someone-else', firstname: 'Mallory' },
    });
    assert.equal(res.status, 200);
    const order = models.payment.store[0];
    assert.equal(order.totalFee, 6600);
    assert.equal(order.status, 'Paid');
    assert.equal(order.user.firstname, 'Ada');
    assert.deepEqual(order.cart.map((line) => line.name).sort(), ['Jollof', 'Suya']);
});

test('menu price changes after adding to cart are charged at the current menu price', async () => {
    const { token } = await h.signupAndLogin(api.call, { email: 'a@test.com' });
    const { jollof } = await buildCart(token);
    jollof.price = 2000; // owner raised the price: 2 x 2000 + 2000 = 6000 items + 1600 = 7600
    h.paystack.succeed(760000);
    const res = await pay(token);
    assert.equal(res.status, 200);
    assert.equal(models.payment.store[0].totalFee, 7600);
});

test('paying less than the total is flagged, not accepted', async () => {
    const { token } = await h.signupAndLogin(api.call, { email: 'a@test.com' });
    await buildCart(token);
    // The old site only charged the items total (5000) and skipped the delivery fee.
    h.paystack.succeed(500000);

    const res = await pay(token);
    assert.equal(res.status, 409);
    assert.match(res.body.message, /REF-1/, 'the customer is told which reference to quote to support');

    assert.equal(models.payment.store.length, 1, 'the payment is still recorded so money is never lost track of');
    assert.equal(models.payment.store[0].status, 'Flagged');
    assert.ok(models.cart.store.every((row) => row.status === 'Pending'), 'the cart is left alone');

    const admin = await h.adminLoginToken(api.call);
    const queue = await api.call('GET', '/getNewOrder', { token: admin });
    assert.equal(queue.body.status, false, 'a flagged payment never appears as a paid order for the kitchen');

    const retry = await pay(token);
    assert.equal(retry.status, 409, 'retrying a flagged payment must not turn it into success');
});

test('overpaying or paying in the wrong currency is also flagged', async () => {
    const { token } = await h.signupAndLogin(api.call, { email: 'a@test.com' });
    await buildCart(token);
    h.paystack.succeed(999999);
    assert.equal((await pay(token)).status, 409);

    h.fake.resetAll();
    const second = await h.signupAndLogin(api.call, { email: 'b@test.com' });
    await buildCart(second.token);
    h.paystack.succeed(660000, { currency: 'USD' });
    assert.equal((await pay(second.token, { reference: 'REF-2' })).status, 409);
});

test('an unsuccessful or unknown Paystack transaction creates nothing', async () => {
    const { token } = await h.signupAndLogin(api.call, { email: 'a@test.com' });
    await buildCart(token);

    h.paystack.fail('abandoned');
    const abandoned = await pay(token);
    assert.equal(abandoned.status, 402);

    h.paystack.respond = () => ({ ok: false, status: 404, json: async () => ({ status: false, message: 'Transaction reference not found' }) });
    const unknown = await pay(token, { reference: 'MADE-UP' });
    assert.equal(unknown.status, 402);

    assert.equal(models.payment.store.length, 0);
    assert.ok(models.cart.store.every((row) => row.status === 'Pending'));
});

test('when Paystack cannot be reached the customer gets a clear error and nothing is recorded', async () => {
    const { token } = await h.signupAndLogin(api.call, { email: 'a@test.com' });
    await buildCart(token);
    h.paystack.networkError = true;
    const res = await pay(token);
    assert.equal(res.status, 502);
    assert.match(res.body.message, /REF-1/);
    assert.equal(models.payment.store.length, 0);
    assert.ok(models.cart.store.every((row) => row.status === 'Pending'), 'the cart stays so they can retry');
});

test('a missing PAYSTACK_SECRET_KEY fails safe', async () => {
    const { token } = await h.signupAndLogin(api.call, { email: 'a@test.com' });
    await buildCart(token);
    const saved = process.env.PAYSTACK_SECRET_KEY;
    delete process.env.PAYSTACK_SECRET_KEY;
    try {
        const res = await pay(token);
        assert.equal(res.status, 502);
        assert.equal(models.payment.store.length, 0);
    } finally {
        process.env.PAYSTACK_SECRET_KEY = saved;
    }
});

test('the same payment cannot create two orders', async () => {
    const { token } = await h.signupAndLogin(api.call, { email: 'a@test.com' });
    await buildCart(token);
    h.paystack.succeed(660000);

    assert.equal((await pay(token)).status, 200);
    const again = await pay(token);
    assert.equal(again.status, 200);
    assert.match(again.body.message, /already recorded/i);
    assert.equal(models.payment.store.length, 1);
    assert.equal(h.paystack.calls.length, 1, 'no second Paystack call for a reference we already hold');
});

test("another customer cannot claim someone else's payment reference", async () => {
    const alice = await h.signupAndLogin(api.call, { email: 'alice@test.com' });
    const bob = await h.signupAndLogin(api.call, { email: 'bob@test.com' });
    await buildCart(alice.token);
    h.paystack.succeed(660000);
    assert.equal((await pay(alice.token)).status, 200);

    await buildCart(bob.token);
    const res = await pay(bob.token);
    assert.equal(res.status, 409);
    assert.equal(models.payment.store.length, 1);
    assert.ok(models.cart.store.filter((r) => String(r.user) === String(bob.user._id)).every((r) => r.status === 'Pending'));
});

test('one successful payment cannot be reused for a second, bigger order', async () => {
    const { token } = await h.signupAndLogin(api.call, { email: 'a@test.com' });
    const { jollof } = await buildCart(token);
    h.paystack.succeed(660000);
    assert.equal((await pay(token)).status, 200);

    // Same customer builds another cart and replays the old reference.
    await api.call('POST', '/userCart', { token, body: { item: { _id: String(jollof._id) }, quantity: 5 } });
    const replay = await pay(token);
    assert.equal(replay.status, 200, 'treated as the already-recorded payment');
    assert.equal(models.payment.store.length, 1);
    const pending = models.cart.store.filter((row) => row.status === 'Pending');
    assert.equal(pending.length, 1, 'the new items were NOT marked paid by replaying the old reference');
});

test('payment is refused for an empty cart, a missing reference, or an item removed from the menu', async () => {
    const { token } = await h.signupAndLogin(api.call, { email: 'a@test.com' });
    h.paystack.succeed(660000);

    const empty = await pay(token);
    assert.equal(empty.status, 400);
    assert.equal(h.paystack.calls.length, 0, 'Paystack is not even asked');

    const { suya } = await buildCart(token);
    const noRef = await api.call('POST', '/makingPayment', { token, body: delivery });
    assert.equal(noRef.status, 400);

    models.food.store.splice(models.food.store.indexOf(suya), 1);
    const removed = await pay(token);
    assert.equal(removed.status, 409);
    assert.match(removed.body.message, /Suya/);
    assert.equal(models.payment.store.length, 0);
});

test('order history only returns the logged-in customer\'s orders', async () => {
    const alice = await h.signupAndLogin(api.call, { email: 'alice@test.com' });
    const bob = await h.signupAndLogin(api.call, { email: 'bob@test.com' });
    await buildCart(alice.token);
    h.paystack.succeed(660000);
    await pay(alice.token);

    const mine = await api.call('GET', `/getUserHistory/${bob.user._id}`, { token: alice.token });
    assert.equal(mine.body.status, true);
    assert.equal(mine.body.data.length, 1);
    const theirs = await api.call('GET', `/getUserHistory/${alice.user._id}`, { token: bob.token });
    assert.equal(theirs.body.status, false, "Bob cannot read Alice's history by id");
});

// ---------------- admin order handling ----------------

test('admin sees paid orders and can accept or decline each one only once', async () => {
    const { token } = await h.signupAndLogin(api.call, { email: 'a@test.com' });
    await buildCart(token);
    h.paystack.succeed(660000);
    await pay(token);
    const admin = await h.adminLoginToken(api.call);

    const queue = await api.call('GET', '/getNewOrder', { token: admin });
    assert.equal(queue.body.data.length, 1);
    const orderId = String(queue.body.data[0]._id);

    assert.equal((await api.call('POST', '/acceptOffer', { token: admin, body: { orderId: 'bad' } })).status, 400);
    assert.equal((await api.call('POST', '/acceptOffer', { token: admin, body: { orderId: { $ne: null } } })).status, 400);

    const accepted = await api.call('POST', '/acceptOffer', { token: admin, body: { orderId } });
    assert.equal(accepted.status, 200);
    assert.equal(models.payment.store[0].status, 'Accepted');

    assert.equal((await api.call('POST', '/declineOffer', { token: admin, body: { orderId } })).status, 404, 'an accepted order cannot be declined later');
    assert.equal((await api.call('POST', '/acceptOffer', { token: admin, body: { orderId } })).status, 404);
    assert.equal(models.payment.store[0].status, 'Accepted');

    const history = await api.call('GET', '/getAllUserHistory', { token: admin });
    assert.equal(history.body.data.length, 1);
});

test('a flagged order cannot be accepted by the kitchen', async () => {
    const { token } = await h.signupAndLogin(api.call, { email: 'a@test.com' });
    await buildCart(token);
    h.paystack.succeed(500000);
    await pay(token);
    const admin = await h.adminLoginToken(api.call);
    const orderId = String(models.payment.store[0]._id);
    assert.equal((await api.call('POST', '/acceptOffer', { token: admin, body: { orderId } })).status, 404);
    assert.equal(models.payment.store[0].status, 'Flagged');
});
