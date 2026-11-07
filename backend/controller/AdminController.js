const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const adminModel = require("../model/adminModel");
const { signToken, toPublicAccount } = require("../middleware/auth");
const { asString, cleanText, isEmail } = require("../utils/validate");

const MIN_PASSWORD_LENGTH = 6;

// Compare secrets without leaking how many leading characters matched.
const safeEqual = (a, b) => {
    const digest = (value) => crypto.createHash("sha256").update(value).digest();
    return crypto.timingSafeEqual(digest(a), digest(b));
};

const adminSignup = async (req, res) => {
    try {
        // Admin accounts can only be created by someone who knows the secret set on the server.
        const expectedCode = process.env.ADMIN_SIGNUP_CODE;
        if (!expectedCode) {
            return res.status(403).json({ message: "Admin signup is disabled", status: false });
        }
        if (!safeEqual(asString(req.body.adminToken), expectedCode)) {
            return res.status(403).json({ message: "invalid Admin token", status: false });
        }

        const firstname = cleanText(req.body.firstname, 60);
        const lastname = cleanText(req.body.lastname, 60);
        const phonenumber = cleanText(req.body.phonenumber, 30);
        const email = cleanText(req.body.email, 254);
        const password = asString(req.body.password);

        if (!firstname || !lastname || !phonenumber || !isEmail(email)) {
            return res.status(400).json({ message: "Please fill in all fields with valid details", status: false });
        }
        if (password.length < MIN_PASSWORD_LENGTH) {
            return res.status(400).json({
                message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
                status: false,
            });
        }

        const existing = await adminModel.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "User already exists", status: false });
        }

        await new adminModel({ firstname, lastname, phonenumber, email, password }).save();

        return res.status(200).json({ message: "User signed up successfully", status: true });
    } catch (error) {
        if (error && error.code === 11000) {
            return res.status(409).json({ message: "User already exists", status: false });
        }
        console.error("admin signup failed:", error.message);
        return res.status(500).json({ message: "Oops! Something went wrong.", status: false });
    }
};

const adminLogin = async (req, res) => {
    try {
        const email = asString(req.body.email);
        const password = asString(req.body.password);

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required", status: false });
        }

        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "User not found", status: false });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect password", status: false });
        }

        return res.status(200).json({
            message: "Login successful",
            status: true,
            token: signToken("admin", admin, "6h"),
            user: toPublicAccount(admin),
        });
    } catch (error) {
        console.error("admin login failed:", error.message);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};

// requireAdmin has already verified the token and loaded the account.
const adminAuthorization = (req, res) => {
    return res.status(200).json({ user: toPublicAccount(req.admin), status: true });
};

module.exports = { adminAuthorization, adminSignup, adminLogin };
