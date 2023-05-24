const { userModel } = require("../model/register");
const {resgisterService, loginService, getUsersListService, updateUser, deleteUser} = require("../services");
const sendToken = require("../utils/jwttoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require('crypto');
const registerUser = async(req, res) => {
    try {

        const data = await resgisterService(req.body);
        sendToken(data, 201, res);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const loginUser = async(req, res) => {
    try {
       const user = await loginService(req.body.email);
       if(!user) return res.status(400).json({
        success: false,
        message: 'User Not Found'
       })
       const userPassVerify = await user.comparePasword(req.body.password);
       if(!userPassVerify) {
        return res.status(400).json({
            success: false,
            message: 'Wrong Password'
        })
    }

   await sendToken(user, 200, res);

    } catch (error) {
     res.status(400).json({
        success: false,
        message: error
     })   
    }
}

const getAllSUsers = async(req, res) => {
    try {
        const data = await getUsersListService();
        res.status(200).json({
            data
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        }) 
    }
}

const userLogout = async(req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({
            success: true,
            message: 'Logout Successfully'
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const forgotPassword = async(req, res) => {
    const user = await loginService(req.body.email);

    if(!user) {
        return res.status(404).json({
        success: false,
        message: 'User not found'
    })}

    //get reset token
   const resetToken = await user.generatingResetPassToken();
   await user.save({validateBeforeSave: false}); //saving reset token and expiry time into document

   const resetUrl = `${req.protocol}://${req.get('host')}/reset/password/${resetToken}`;

   const message = `Your password reset token is : \n\n ${resetUrl}`
    try {
     await sendEmail({
        email: user.email,
        subject: 'Reset Password Request',
        message
       })
    return res.status(200).json({
        success: true,
        message: `Reset token sent to ${user.email}`
     })
    } catch (error) {
       user.resetPasswordToken = undefined;
       user.resetPasswordTokenExpire = undefined;
       await user.save({validateBeforeSave: false});
       res.status(400).json({
        success: false,
        message: error.message
       })
    }
}

const resetPassword = async(req, res) => {
    const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
    try {
    const user = await userModel.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: {$gt: Date.now()}
    });
     if(!user) return res.status(404).json({
        success: false,
        message: 'Token expired please generate new one'
     })

     if(req.body.newpassword !== req.body.confirmpassword) {
        return res.status(401).json({
        success: false,
        message: 'Password Missmatch'
     })}

     user.password = req.body.newpassword;
     
     user.resetPasswordToken = undefined;
     user.resetPasswordTokenExpire = undefined;
     await user.save();
     return res.status(202).json({
        success: true,
        message: 'User Password reset successfylly'
     })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const update = async(req, res) => {
    try {
        const id = req.params.id;
        const user = await updateUser(id, req.body);
        res.status(201).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const deleteUserData = async(req, res) => {
    try {
        const user = await deleteUser(req.params.id);
        return res.status(201).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}
module.exports = {registerUser, loginUser, getAllSUsers, userLogout, forgotPassword, resetPassword, update, deleteUserData};