const bcrypt = require("bcryptjs");
const userModel = require("../model/userModel");
const { signToken, toPublicAccount } = require("../middleware/auth");
const { asString, cleanText, isEmail } = require("../utils/validate");

const MIN_PASSWORD_LENGTH = 6;

const signup = async (req, res) => {
    try {
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

        const existing = await userModel.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "User already exists", status: false });
        }

        // The model hashes the password on save.
        await new userModel({ firstname, lastname, phonenumber, email, password }).save();

        return res.status(200).json({ message: "User signed up successfully", status: true });
    } catch (error) {
        if (error && error.code === 11000) {
            return res.status(409).json({ message: "User already exists", status: false });
        }
        console.error("signup failed:", error.message);
        return res.status(500).json({ message: "Oops! Something went wrong.", status: false });
    }
};

const login = async (req, res) => {
    try {
        const email = asString(req.body.email);
        const password = asString(req.body.password);

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required", status: false });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found", status: false });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(203).json({ message: "Incorrect password", status: false });
        }

        return res.status(201).json({
            message: "Login successful",
            status: true,
            token: signToken("user", user, "12h"),
            user: toPublicAccount(user),
        });
    } catch (error) {
        console.error("login failed:", error.message);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};

// requireUser has already verified the token and loaded the account.
const authorization = (req, res) => {
    return res.status(200).json({ user: toPublicAccount(req.user), status: true });
};

// The account being edited always comes from the token, never from the URL.
const updateUserProfile = async (req, res) => {
    try {
        const updates = {};
        ["firstname", "lastname", "phonenumber"].forEach((field) => {
            const value = cleanText(req.body[field], 60);
            if (value) updates[field] = value;
        });

        const email = cleanText(req.body.email, 254);
        if (email) {
            if (!isEmail(email)) {
                return res.status(400).json({ status: false, message: "Please enter a valid email address" });
            }
            updates.email = email;
        }

        // Only change the picture when a new one was uploaded.
        if (req.file && req.file.path) {
            updates.profileImage = req.file.path;
        }

        const updated = await userModel.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true });

        return res.status(201).json({
            status: true,
            message: "Profile Update Successful",
            data: toPublicAccount(updated),
        });
    } catch (error) {
        console.error("profile update failed:", error.message);
        const message = error && error.code === 11000 ? "That email is already in use" : "Failed in updating profile";
        return res.status(203).json({ status: false, message });
    }
};

const password = async (req, res) => {
    try {
        const newPassword = asString(req.body.password);
        if (newPassword.length < MIN_PASSWORD_LENGTH) {
            return res.status(400).json({
                status: false,
                message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
            });
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);
        await userModel.updateOne({ _id: req.user._id }, { $set: { password: hashPassword } });

        return res.status(201).json({ status: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("password update failed:", error.message);
        return res.status(203).json({ status: false, message: "Failed in updating Password" });
    }
};

module.exports = {
    signup,
    login,
    authorization,
    updateUserProfile,
    password
};
