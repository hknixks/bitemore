const mongoose  = require("mongoose");
const bcryptjs = require('bcryptjs')

const adminSchema = new mongoose.Schema({
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
adminSchema.pre('save', async function(next){
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcryptjs.hash(this.password, saltRound);
        next();
    } catch (err) {
        next(err);
    }
})

const adminModel = mongoose.model('admin', adminSchema);

module.exports = adminModel ;
