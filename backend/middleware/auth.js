const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");
const adminModel = require("../model/adminModel");

const ALGORITHM = "HS256";

// Fields that must never be sent to a client.
const PRIVATE_FIELDS = ["password", "otp", "otpHash", "otpExpires", "otpAttempts", "adminToken", "__v"];

const signToken = (role, account, expiresIn) => {
    return jwt.sign(
        { id: String(account._id), email: account.email, role },
        process.env.SECRET,
        { expiresIn, algorithm: ALGORITHM }
    );
};

// Returns a plain object safe to send to the browser (no password hash, OTP data, etc.)
const toPublicAccount = (doc) => {
    if (!doc) return doc;
    const obj = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };
    PRIVATE_FIELDS.forEach((field) => delete obj[field]);
    return obj;
};

const getBearerToken = (req) => {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");
    return scheme === "Bearer" && token ? token : null;
};

const makeGuard = (role, model, requestKey) => async (req, res, next) => {
    const token = getBearerToken(req);
    if (!token) {
        return res.status(401).json({ message: "Authentication required", status: false });
    }

    let payload;
    try {
        payload = jwt.verify(token, process.env.SECRET, { algorithms: [ALGORITHM] });
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token", status: false });
    }

    // Tokens issued before roles existed have no role/id; they are rejected and the person logs in again.
    if (payload.role !== role || !payload.id) {
        return res.status(403).json({ message: "You are not allowed to do this", status: false });
    }

    try {
        const account = await model.findById(payload.id);
        if (!account) {
            return res.status(401).json({ message: "Account not found", status: false });
        }
        req[requestKey] = account;
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token", status: false });
    }
};

const requireUser = makeGuard("user", userModel, "user");
const requireAdmin = makeGuard("admin", adminModel, "admin");

module.exports = { requireUser, requireAdmin, signToken, toPublicAccount };
