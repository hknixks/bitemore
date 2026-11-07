// Server-side check of a Paystack transaction. The browser can claim anything, so an order is only
// recorded as paid after Paystack itself confirms the reference was successful and for how much.
const PAYSTACK_VERIFY_URL = "https://api.paystack.co/transaction/verify/";

const verifyTransaction = async (reference) => {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
        throw new Error("PAYSTACK_SECRET_KEY is not set");
    }

    const response = await fetch(PAYSTACK_VERIFY_URL + encodeURIComponent(reference), {
        headers: { Authorization: `Bearer ${secretKey}` },
        signal: AbortSignal.timeout(15000),
    });

    let body = null;
    try {
        body = await response.json();
    } catch (error) {
        body = null;
    }

    if (!response.ok || !body || body.status !== true || !body.data) {
        return { ok: false, reason: (body && body.message) || `Paystack responded with HTTP ${response.status}` };
    }
    return { ok: true, data: body.data };
};

module.exports = { verifyTransaction };
