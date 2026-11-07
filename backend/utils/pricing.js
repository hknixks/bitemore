// The delivery fee rule mirrors what the checkout page has always shown: a flat fee per cart line.
// Keep this in one place so the amount charged, the amount verified and the order record always agree.
const DELIVERY_FEE_PER_LINE = Number(process.env.DELIVERY_FEE_PER_LINE) || 800;

const toKobo = (naira) => Math.round(naira * 100);

// lines: [{ price, quantity }] where price comes from the menu (never from the client).
const calculateTotals = (lines) => {
    const amount = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
    const deliveryFee = lines.length * DELIVERY_FEE_PER_LINE;
    return { amount, deliveryFee, totalFee: amount + deliveryFee };
};

module.exports = { DELIVERY_FEE_PER_LINE, toKobo, calculateTotals };
