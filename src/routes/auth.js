const express = require('express');

const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const User = require("../models/user")

authRouter.post("/signup",async(req,res)=>{

    try{
    //validation of data
    
    validateSignUpData(req);

    //Encrypt the password
    const {firstName,lastName,emailId,password} = req.body

    const passwordHash = await bcrypt.hash(password,10)
    console.log(passwordHash);
    


    // // Creating a new instance of the User Model
    const user = new User({
        firstName,lastName,emailId,password:passwordHash,
    })

    await user.save();
    res.send("User Added successfully")}
    catch(err){
        res.status(400).send("Error saving the user:" + err.message)
    }
})

authRouter.post("/login",async(req,res)=>{
    try{
        const {emailId,password} = req.body

        const user = await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid Credentials")
        }

        const isPasswordValid = await bcrypt.compare(password,user.password)

        if(isPasswordValid){

            // Create a JWT token

            const token = await jwt.sign({_id:user._id}, "DEV@Friends#0219")
            console.log(token);
            


            res.cookie("token",token,{
                expires: new Date(Date.now() + 8 *3600000)
            }) 
            res.send("login successfully")
        }else{
            throw new Error("Password is not correct")
        }

    }
    catch(err){
        res.status(400).send("Something went wrong " + err.message)
    }
})

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    })
    res.send("Logout successful")
})

module.exports = authRouter