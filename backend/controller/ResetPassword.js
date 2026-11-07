const crypto = require('crypto');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const userModel = require('../model/userModel');
const { asString } = require('../utils/validate');
dotenv.config()

const passkey = process.env.PASS;
const usermail = process.env.MAIL;

const OTP_TTL_MS = 10 * 60 * 1000;      // a code works for 10 minutes
const RESEND_COOLDOWN_MS = 60 * 1000;   // and a new one can be requested once a minute
const MAX_OTP_ATTEMPTS = 5;             // wrong guesses allowed before the code is thrown away
const MIN_PASSWORD_LENGTH = 6;

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: usermail,
    pass: passkey,
  },
});

const generateOtp = () => String(crypto.randomInt(100000, 1000000));

// Only a keyed hash of the code is stored, tied to the email it was issued for.
const hashOtp = (email, otp) =>
  crypto.createHmac('sha256', process.env.SECRET).update(`${email}:${otp}`).digest('hex');

const hashesMatch = (a, b) => {
  const left = Buffer.from(a, 'hex');
  const right = Buffer.from(b, 'hex');
  return left.length === right.length && crypto.timingSafeEqual(left, right);
};

const clearOtp = (userId) =>
  userModel.updateOne({ _id: userId }, { $unset: { otpHash: 1, otpExpires: 1 }, $set: { otpAttempts: 0 } });

// Checks a submitted code against the stored one. Counts wrong guesses and discards the code
// when it expires or too many wrong guesses were made.
const checkOtp = async (user, email, otp) => {
  if (!user.otpHash || !user.otpExpires) {
    return { ok: false, status: 400, message: 'No active code. Please request a new one.' };
  }
  if (new Date() > user.otpExpires) {
    await clearOtp(user._id);
    return { ok: false, status: 401, message: 'OTP has expired' };
  }
  if ((user.otpAttempts || 0) >= MAX_OTP_ATTEMPTS) {
    await clearOtp(user._id);
    return { ok: false, status: 429, message: 'Too many incorrect attempts. Please request a new code.' };
  }
  if (!/^\d{6}$/.test(otp) || !hashesMatch(hashOtp(email, otp), user.otpHash)) {
    await userModel.updateOne({ _id: user._id }, { $inc: { otpAttempts: 1 } });
    return { ok: false, status: 401, message: 'Invalid OTP' };
  }
  return { ok: true };
};

const buildEmail = (otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset OTP</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        h1 { color: #333; }
        p { margin-bottom: 20px; }
        .otp { font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Password Reset OTP</h1>
        <p>Your OTP code for password reset is:</p>
        <p class="otp">${otp}</p>
        <p>Please use this code to reset your password. It expires in 10 minutes. If you did not ask for this, you can ignore this email.</p>
    </div>
</body>
</html>`;

const sendResetEmail = async (req, res) => {
  try {
    const email = asString(req.body.email);
    if (!email) {
      return res.status(400).json({ message: 'Email is required', status: false });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found', status: false });
    }

    // Stops someone from using this endpoint to flood an inbox.
    if (user.otpExpires) {
      const issuedAt = user.otpExpires.getTime() - OTP_TTL_MS;
      if (Date.now() - issuedAt < RESEND_COOLDOWN_MS) {
        return res.status(429).json({ message: 'Please wait a minute before requesting another code.', status: false });
      }
    }

    const otp = generateOtp();
    await userModel.updateOne(
      { _id: user._id },
      { $set: { otpHash: hashOtp(email, otp), otpExpires: new Date(Date.now() + OTP_TTL_MS), otpAttempts: 0 } }
    );

    try {
      await transporter.sendMail({
        from: usermail,
        to: email,
        subject: 'Your OTP Code',
        html: buildEmail(otp),
      });
    } catch (mailError) {
      await clearOtp(user._id);
      console.error('Could not send reset email:', mailError.message);
      return res.status(500).json({ message: 'We could not send the email. Please try again.', status: false });
    }

    return res.status(200).json({ message: 'Email sent successful', status: true });
  } catch (error) {
    console.error('sendResetEmail failed:', error.message);
    res.status(500).json({ message: 'Internal server error', status: false });
  }
};

// Lets the page confirm the code before showing the new-password form. It does not use the code up:
// the final reset step has to present it again.
const verifyOTP = async (req, res) => {
  try {
    const email = asString(req.body.email);
    const otp = asString(req.body.otp);

    const user = email ? await userModel.findOne({ email }) : null;
    if (!user) {
      return res.status(404).json({ message: 'User not found', status: false });
    }

    const result = await checkOtp(user, email, otp);
    if (!result.ok) {
      return res.status(result.status).json({ message: result.message, status: false });
    }
    return res.status(200).json({ message: 'OTP verified successfully', status: true });
  } catch (error) {
    console.error('verifyOTP failed:', error.message);
    res.status(500).json({ message: 'Internal server error', status: false });
  }
};

// The password only changes when a valid, unexpired code for this email is supplied.
const resetPassword = async (req, res) => {
  try {
    const email = asString(req.body.email);
    const otp = asString(req.body.otp);
    const newPassword = asString(req.body.newPassword);

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Missing required data', status: false });
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
        status: false,
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found', status: false });
    }

    const result = await checkOtp(user, email, otp);
    if (!result.ok) {
      return res.status(result.status).json({ message: result.message, status: false });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    await userModel.updateOne(
      { _id: user._id },
      { $set: { password: hashPassword, otpAttempts: 0 }, $unset: { otpHash: 1, otpExpires: 1 } }
    );

    return res.status(200).json({ message: 'Password updated successfully', status: true });
  } catch (err) {
    console.error('resetPassword failed:', err.message);
    return res.status(500).json({ message: 'Something went wrong!', status: false });
  }
};

module.exports = { sendResetEmail, resetPassword, verifyOTP };
