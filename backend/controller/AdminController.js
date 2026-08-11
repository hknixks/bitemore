const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const adminModel = require("../model/adminModel");
const { auth } = require("../packages");

dotenv.config();

const SECRET = process.env.SECRET;
const adminSignup = (req, res) => {
    console.log(req.body);
    const { firstname, lastname, phonenumber, adminToken, email, password, profile_image } = req.body;

    if (adminToken !== 'ADMIN') {
        return res.status(500).json({
            message: "invalid Admin token",
            status: false,
        });
    }
    adminModel.findOne({ email })
        .then((user) => {
            if (user) {
                return res.status(500).json({
                    message: "User already exists",
                    status: false,
                });
            }
            const newUser = new adminModel({
                firstname,
                lastname,
                phonenumber,
                email,
                password,
                adminToken,
                profile_image
            });
            newUser.save()
                .then((result) => {
                    console.log(result);
                    res.status(200).json({
                        message: "User signed up successfully",
                        status: true,
                    });
                }).catch((error) => {
                    res.status(500).json({
                        message: "Oops! Something went wrong.",
                        status: false,
                    });
                });
        }).catch((error) => {
            res.status(500).json({
                message: "Internal server error",
                status: false,
            });
        });
};

const adminLogin = (req, res) => {
    const { email, password } = req.body;

    adminModel.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                    status: false,
                });
            }
            bcrypt.compare(password, user.password)
                .then((isPasswordValid) => {
                    if (!isPasswordValid) {
                        return res.status(401).json({
                            message: "Incorrect password",
                            status: false,
                        });
                    };
                    const token = jwt.sign({ email }, SECRET, { expiresIn: "6h" });
                    res.status(200).json({
                        message: "Login successful",
                        status: true,
                        token: token,
                        user: user,
                    });
                }).catch((error) => {
                    res.status(500).json({
                        message: "Internal server error",
                        status: false,
                    });
                });
        }).catch((error) => {
            res.status(500).json({
                message: "Internal server error",
                status: false,
            });
        });
};

const adminAuthorization = async (req, res) => {
    try {
        const result = await auth(req)
        const email = result.email;
        const user = await adminModel.findOne({ email });

        res.status(200).json({
            user: user,
            status: true,
        });
    } catch (err) {
        res.status(500).json({
            message: "Oops, something went wrong",
            status: false,
        });
    }
};


module.exports = { adminAuthorization, adminSignup, adminLogin };