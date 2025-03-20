const jwt = require('jsonwebtoken')
const User = require('../models/user')

const adminAuth = (req,res,next)=>{
    const token = "xyz";
    const isAdminAuthorized = token==="xyz";
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized request");
    }else{
        next();
}}

const userAuth = async(req,res,next)=>{
    try{
        const {token} = req.cookies;

        if(!token){
            throw new Error("Token is not valid")
        }

        const decodedObj = await jwt.verify(token,"DEV@Friends#0219")

        const {_id} = decodedObj;

        const user = await User.findById(_id);
        if(!user){
            throw new User("User not found")
        }

        req.user = user
        next();
    }catch(err){
        res.status(400).send("Something went wrong" + err.message)
    }
}

module.exports = {
    adminAuth,
    userAuth
}


