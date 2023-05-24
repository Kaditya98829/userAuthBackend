const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'enter user name']
    },
    
    email: {
        type: String,
        required: [true, 'enter user email'],
        unique : true
    },
    
    password: {
        type: String,
        required: [true, 'enter user password']
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date
});

//encrypting pass
userSchema.pre('save', async function(next) {
 if(!this.isModified('password')) {
     next();
 }
 this.password = await bcrypt.hash(this.password, 10);
 
})

//comapring pass
userSchema.methods.comparePasword = async function(loginPassword) {
  return await bcrypt.compare(loginPassword, this.password);
}

//JWTAUth
userSchema.methods.getJWTToken = function() {
    return jwt.sign({id: this._id}, process.env.JWTSECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

// reset password
userSchema.methods.generatingResetPassToken = async function() {
// token
const resetToken =  crypto.randomBytes(20).toString('hex');

this.resetPasswordToken = crypto.createHash('sha256')
.update(resetToken)
.digest('hex');

this.resetPasswordTokenExpire = Date.now() + 5 * 60 * 1000;
return resetToken;
}

const userModel = mongoose.model('circle360', userSchema, 'circle360');
module.exports= {userModel};