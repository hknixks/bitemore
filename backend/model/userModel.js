const mongoose  = require("mongoose");
const bcryptjs = require('bcryptjs')

const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    // Password reset: only a hash of the OTP is stored, with an expiry and an attempt counter.
    otpHash:{
        type: String,
        required: false,
    },
    otpExpires:{
        type: Date,
        required: false,
    },
    otpAttempts:{
        type: Number,
        default: 0,
    },
    profileImage:{
        type: String,
        required: false,
    },
    password:{
        type: String,
        required: true
    },
    phonenumber:{
        type: String,
        required: true
    },
},{timestamps: true});

let saltRound = 10
// Only hash when the password actually changed, otherwise any later .save() would hash the hash.
userSchema.pre('save', async function(next){
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcryptjs.hash(this.password, saltRound);
        next();
    } catch (err) {
        next(err);
    }
})

const userModel = mongoose.model('user', userSchema);

module.exports = userModel ;
