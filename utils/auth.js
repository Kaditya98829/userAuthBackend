const jwt = require('jsonwebtoken');
const { userModel } = require('../model/register');

const isUserAuth = async(req, res, next) => {
const {token} = req.cookies;
if(!token) {
   return res.status(401).json({
        success: false,
        messsage: 'Bad Authentication'
    })
}

const decodeToken = jwt.verify(token, process.env.JWTSECRET)

 req.user = await userModel.findById(decodeToken.id);
 next();
}
module.exports = isUserAuth;