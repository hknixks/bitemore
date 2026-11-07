const { rateLimit } = require("express-rate-limit");

const build = (windowMs, limit, message) =>
    rateLimit({
        windowMs,
        limit,
        standardHeaders: "draft-7",
        legacyHeaders: false,
        message: { message, status: false },
    });

const FIFTEEN_MINUTES = 15 * 60 * 1000;

// Whole API: generous, just stops runaway clients.
const apiLimiter = build(FIFTEEN_MINUTES, 600, "Too many requests, please slow down.");

// Login and signup: slows down password guessing.
const authLimiter = build(FIFTEEN_MINUTES, 20, "Too many attempts. Please try again in a few minutes.");

// Anything that sends or checks a reset code.
const otpLimiter = build(FIFTEEN_MINUTES, 10, "Too many reset attempts. Please try again in a few minutes.");

module.exports = { apiLimiter, authLimiter, otpLimiter };
