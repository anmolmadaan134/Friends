const express = require("express")

const app = express()

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

app.use("/user",
    
    [(req,res,next)=>{ 
   // res.send("Response") //Here if we don't use any thing or just use console.log then request will be sended to server infinite times and you will not get any response
    console.log("1st Route");
    
    next();
    //res.send("Response")
},
(req,res,next)=>{
    console.log("2nd Route");
    
    //res.send("2nd Response")
    next();
},],
(req,res,next)=>{
    console.log("3rd Route");
    //res.send("3rd Response")
    next();
},
(req,res,next)=>{
    console.log("4th Route");
    //res.send("4th Response")
    next();
},
(req,res,next)=>{
    console.log("5th Route");
    res.send("5th Response")
},
)

app.listen(3001,()=>{
    console.log("Successfully running on port 3001");
    
})