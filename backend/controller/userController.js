const jwt = require("jsonwebtoken");
const cartModel = require("../model/cartModel");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const userModel = require("../model/userModel");
const { auth, uploadImage } = require("../packages");

dotenv.config();

const SECRET = process.env.SECRET;
const signup = (req, res) => {
    const { firstname, lastname, phonenumber, email, password, profile_image } = req.body;

    userModel.findOne({ email })
        .then((user) => {
            if (user) {
                return res.status(500).json({
                    message: "User already exists",
                    status: false,
                });
            }
            const newUser = new userModel({
                firstname,
                lastname,
                phonenumber,
                email,
                password,
                profile_image
            });
            newUser.save()
                .then((result) => {
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

const login = (req, res) => {
    const { email, password } = req.body;

    userModel.findOne({ email })
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
                        return res.status(203).json({
                            message: "Incorrect password",
                            status: false,
                        });
                    }
                    const token = jwt.sign({ email }, SECRET, { expiresIn: "12h" });
                    res.status(201).json({
                        message: "Login successful",
                        status: true,
                        token: token,
                        user: user,
                    });
                }).catch((error) => {
                    res.status(203).json({
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

const authorization = async (req, res) => {
    try {
        // const token = req.headers.authorization.split(" ")[1];
        // const result = await jwt.verify(token, SECRET);
        const result = await auth(req)
        const email = result.email;
        const user = await userModel.findOne({ email });

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


const updateUserProfile = (req, res) => {
    const { _id } = req.params;
    const profileImage = (req.file.path);
    const { firstname, lastname, email, phonenumber } = req.body;

    userModel.findByIdAndUpdate(_id, { firstname, lastname, email, phonenumber, profileImage: profileImage })

        .then(data => {
            res.status(201).json({
                status: true,
                message: "Profile Update Successful",
                data

            })
        }).catch(err => {
            res.status(203).json({
                status: false,
                message: "Failed in updating profile"
            })
            console.log(err, "wahala o in editing profile");
        })
}

const password = async (req, res) => {
    const { _id } = req.params;
    const { password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    userModel.findByIdAndUpdate({ _id }, { $set: { password: hashPassword } })
    
    .then(data => {
            res.status(201).json({
                status: true,
                message: 'Password updated successfully',
                data

            })
        }).catch(err => {
            res.status(203).json({
                status: false,
                message: "Failed in updating Password"
            })
            console.log(err, "wahala o in editing profile");
        })

}


module.exports = {
    signup,
    login,
    authorization,
    updateUserProfile,
    password
};
