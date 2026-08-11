const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const userModel = require('../model/userModel');
dotenv.config()

const passkey = process.env.PASS;
const usermail = process.env.MAIL;

const tokenStorage = new Map();

function generatePin() {
  return Math.floor(1000 + Math.random() * 9000);
}

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: usermail,
    pass: passkey,
  },
});

const sendResetEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const resetToken = generatePin();
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 24); // Token expires in 24 hours

    tokenStorage.set(resetToken, { email, expires: expirationDate, pin: resetToken });

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        status: false
      });
    }

    const mailOptions = {
      from: usermail,
      to: email,
      subject: 'Your OTP Code',
      html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset OTP</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 8px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    }
                    h1 {
                        color: #333;
                    }
                    p {
                        margin-bottom: 20px;
                    }
                    .otp {
                        font-size: 24px;
                        font-weight: bold;
                        color: #007bff;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Password Reset OTP</h1>
                    <p>Your OTP code for password reset is:</p>
                    <p class="otp">${resetToken}</p>
                    <p>Please use this code to reset your password. This code will expire in 24 hours.</p>
                </div>
            </body>
            </html>
            `
    };
    await transporter.sendMail(mailOptions);
    await userModel.updateOne({ email }, { $set: { otp: resetToken } });
    return res.status(200).json({
      message: 'Email sent successful',
      status: true,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', status: false });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        status: false
      });
    }

    const storedToken = tokenStorage.get(Number(otp));
    if (!storedToken) {
      return res.status(404).json({
        message: 'OTP not found',
        status: false
      });
    }
    if (new Date() > storedToken.expires) {
      tokenStorage.delete(otp);
      return res.status(401).json({
        message: 'OTP has expired',
        status: false
      });
    }
    if (storedToken.email !== email) {
      return res.status(401).json({
        message: 'Invalid OTP',
        status: false
      });
    }
    return res.status(200).json({
      message: 'OTP verified successfully',
      status: true
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      status: false
    });
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Missing required data' });
  }
  try {
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(500).json({
        message: 'User not found',
        status: false
      });
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    user = await userModel.updateOne({ email }, { $set: { password: hashPassword, otp: null } });
    return res.status(200).json({
      message: 'Password updated successfully',
      status: true
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Something went wrong!',
      status: false
    });
  }
};


// // Update an existing user's information
// exports.updateUserInfo = async (req, res) => {
//   const id = req.params.id;
//   const updateData = req.body;

//   try {
//     // Check to see if the user trying to modify their own info
//     if (id !== req.userId && req.role != 'admin')
//       throw new Error("You don't have permission to perform this action.");

//     // Look up the user in question
//     let user = await User.findByIdAndUpdate(id, updateData, { new: true });

//     // If no user was found with that ID then send back a 404 not found error
//     if (!user) throw new Error('No user found');

//     // Send back a successful response along with the updated user object
//     return res.status(200).json({
//       data: user,
//       message: 'Successfully updated',
//       status: true
//     })
//   } catch (e) {
//     // If there was an error somewhere in
//     // our code then we will send back a 500 internal server error and some error text.
//     return res.status(500).json({
//       error: e.message || "An error occurred while processing your request.",
//       status: false
//     });
//   };
// };

// // Delete a specific user from the database
// exports.deleteUser = async (req, res) => {
//   const userId = req.params.id;

//   // Make sure the current logged in user is an admin or they are trying to delete themselves
//   if (req.role != 'admin' && req.userId != userId) {
//     return res.status(401).json({
//       error: "Unauthorized -  Only admins can delete users",
//       status: false
//     });
//   }

//   try {
//     let user = await User.findOneAndRemove({ _id: userId })

//     if (!user) {
//       throw new Error("The specified user does not exist.")
//     }

//     res.status(200).json({
//       data: null,
//       message: `User ${user.username} has been deleted`,
//       status: true
//     })
//   } catch (e) {
//     return res.status(400).json({
//       error: e.message || "Something went wrong!",
//       status: false
//     })
//   }
// }

// // Update a specific user by ID
// exports.updateUser = async (req, res) => {
//   const userId = req.params.id;
//   const updateOps = {};
//   for (const ops of req.body.ops) {
//     updateOps[ops.propName] = ops.value;
//   }

//   // Checks whether the requesting user is updating their own profile or another user's profile
//   // If it's not the same user then only allow admins to make changes
//   if (req.userId != userId) {
//     if (req.role != 'admin') {
//       return res.status(401).json({
//         error: "You are not authorised to perform this action.",
//         status: false
//       });
//     }
//   }

//   try {
//     const user = await User.findByIdAndUpdate(userId, updateOps, { new: true });
//     if (!user) {
//       return res.status(404).json({
//         error: "No user with that Id exists.",
//         status: false
//       })
//     }
//     res.json({
//       data: user.transform(),
//       message: `User ${user.username}'
//       updated successfully.` ,
//       status: true
//     })
//   } catch (e) {
//     console.log("Error in updating user : ", e);
//     res.status(400).json({
//       error: "An error occurred while updating the user.",
//       status: false
//     })
//   }
// }

// exports.getUserProfile = async (req, res) => {
//   const userId = req.params.id;
//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404
//       ).json({
//         error: 'User does not exist',
//         status: false
//       })
//     }
//     // .populate('following') is used to get the list of users who are following this user
//     // .exec() is used to execute the query
//     res.json({
//       data: user.profile().format(),
//       status: true
//     });
//   } catch (e) {
//     console.log("Error in getting profile for user " + userId + ":", e);
//     res.status(400).json({
//       error: "Could not load user profile.",
//       status: false
//     })
//   }
// };

// // @desc   Follow a user
// // @route  PUT /api/users/:id/follow
// // @access Private
// exports.followUser = async (req, res) => {
//   const userId = req.params.id
//   const followerId = req.user._id
//   try {
//     let user = await User.findById(userId)
//     user.followers.push(followerId)
//     user.following.push(followerId)
//     await user.save()
//     res.json({
//       data: {
//         user: user.profile()
//       },
//       status: true
//     })
//   } catch (err) {
//     console.error("Error in following user ", err.message);
//     return res.status(400).send("Follow failed")
//   }
// }
// // @desc Unfollow a user
// // @route DELETE /api/users
// //         /:id/unfollow
// // @access Private
// exports.unFollowUser = async (req, res) => {
//   const userId = req.params.id;
//   const removeUserId = req.body.removeUserId || req.user.id;
//   try {
//     let user = await User.findByIdAndUpdate(userId, { $pull: { following: removeUserId } }, { new: true });
//     if (!user) throw new Error('The user could not be found')
//     //return updated user info to front end
//     res.json({ data: user.profile() })
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).send('Server error');
//   }
// };

module.exports = { sendResetEmail, resetPassword, verifyOTP };