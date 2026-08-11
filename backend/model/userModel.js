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
userSchema.pre('save', function(next){
    console.log(this.password);
    bcryptjs.hash(this.password,saltRound )
    .then(res =>{
        this.password = res
        next();
    })
    .catch(err =>{
        console.log(err);
    })
})

userSchema.methods.validatepassword = function (password, callback) {
    bcryptjs.compare(password, this.password, (err, result) => {
        if (err) {
            console.log(err);
            return callback(err);
        }
        console.log(result);
        callback(null, result); 
    });
};



const userModel = mongoose.model('user', userSchema);

module.exports = userModel ;