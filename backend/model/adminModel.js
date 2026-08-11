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
    adminToken:{
        type: String,
        required: true,
    },
    otp:{
        type: Number,
        required: false,
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
adminSchema.pre('save', function(next){
    // console.log(this.password);
    bcryptjs.hash(this.password,saltRound )
    .then(res =>{
        this.password = res
        next();
    })
    .catch(err =>{
        console.log(err);
    })
})

adminSchema.methods.validatepassword = function (password, callback) {
    bcryptjs.compare(password, this.password, (err, result) => {
        if (err) {
            console.log(err);
            return callback(err);
        }
        console.log(result);
        callback(null, result); 
    });
};



const adminModel = mongoose.model('admin', adminSchema);

module.exports = adminModel ;