

// app.get("/user",(req,res)=>{
//     res.send({firstname:"Anmol",lastname:"Madaan"})
// })

// app.post("/user",(req,res)=>{
//     // Saving data to db

//     res.send("Saving data to the database")
// })

// app.use("/test",(req,res)=>{
//     res.send("testing for the server!")
// })

// app.get("/user",(req,res)=>{
//     console.log(req.query);
    
//     res.send({firstname:"Anmol",lastname:"Madaan"})
// })

//GET/users => middleware chain => request handler

// app.use("/",(req,res,next)=>{
//     res.send("Handling route")
// })

// app.get("/user",
    
//     (req,res,next)=>{ 
//    // res.send("Response") //Here if we don't use any thing or just use console.log then request will be sended to server infinite times and you will not get any response
//     console.log("1st Route");
    
//     next();
//     //res.send("Response")
// },
// (req,res,next)=>{
//     console.log("2nd Route");
    
//     //res.send("2nd Response")
//     next();
// },
// (req,res,next)=>{
//     console.log("3rd Route");
//     //res.send("3rd Response")
//     next();
// },
// (req,res,next)=>{
//     console.log("4th Route");
//     //res.send("4th Response")
//     next();
// },
// (req,res,next)=>{
//     console.log("5th Route");
//     res.send("5th Response")
// },
// )

// const {adminAuth} = require("./middlewares/auth")

// app.use("/admin",adminAuth)

// app.get("/admin/getAllData",(req,res)=>{
//     res.send("All Data sent")
// })

// app.get("/admin/deleteUser",(req,res)=>{
//     res.send("User deleted")
// })

const express = require("express")
const connectDB = require("./config/database")
const User = require("./models/user")
const app = express()
const {validateSignUpData} = require("./utils/validation")
const bcrypt = require('bcrypt')
const cookieParser = require("cookie-parser")
const jwt = require('jsonwebtoken');
const {userAuth} = require('./middlewares/auth')


app.use(express.json())
app.use(cookieParser())

app.post("/signup",async(req,res)=>{

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

app.post("/login",async(req,res)=>{
    try{
        const {emailId,password} = req.body

        const user = await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid Credentials")
        }

        const isPasswordValid = await bcrypt.compare(password,user.password)

        if(isPasswordValid){

            // Create a JWT token

            const token = await jwt.sign({_id:user._id}, "DEV@Friends#0219",{expiresIn:"0d"})
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
        res.status(400).send("Something went wrong" + err.message)
    }
})

app.get("/profile",userAuth,async(req,res)=>{

    try{

    
    
    const user = req.user

    
    res.send(user)
}
    catch(err){
        res.status(400).send("Something went wrong" + err.message)
    }
    
})

app.post("/sendConnectionRequest" , userAuth, (req,res,next)=>{
    const user = req.user;

    res.send(user.firstName + " sent the connection request")

})

//Get user by email
app.get("/user",async(req,res)=>{
    const userEmail = req.body.emailId;

    try{
    const users = await User.find({emailId:userEmail})
    if(users.length===0){
        res.status(404).send("Users not found")
    }else{
        res.send(users);
    }
    }
    catch(err){
        res.status(400).send("Something went wrong")
    }
})

//Feed API - GET/feed - get all users from the database
app.get("/feed",async(req,res)=>{
    try {
        const users = await User.find({})
        res.send(users);
    } catch (error) {
        res.status(400).send("Something went wrong")
    }
})

//Delete a user from the database
app.delete("/user",async (req,res)=>{

    const userId = req.body.userId;

    try {
        const user = await User.findByIdAndDelete(userId)
        res.send("User deleted successfully")
    } catch (error) {
        res.status(400).send("Something went wrong")
    }
})

// update the data of a user
app.patch("/user/:userId",async (req,res)=>{
    const userId = req.params?.userId;
    const data = req.body;

    
    try{
        const ALLOWED_UPDATES = [
            "photoUrl","about","gender","age","skills"
          ]
      
          const isUpdateAllowed = Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k))
      
          if(!isUpdateAllowed){
              throw new Error("Update not allowed")
          }

          if(data?.skills.length>10){
            throw new Error("Skills cannot be more than 10")
          }
      
        const user = await User.findByIdAndUpdate(userId,data,{
            new:true,
            runValidators:true,
        })
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send("User updated successfully");
    }catch(error){
        res.status(400).send("Something went wrong" + error.message)
    }
})

connectDB().then(()=>{
    console.log("Database connection established...");
    app.listen(3001,(req,res)=>{
        console.log("Successfully running on port 3001");
        
    })
}).catch(err=>{
    console.error("Database cannot be connected")
})






