const mongoose = require("mongoose")

const connectDB = async()=>{
    await mongoose.connect(
        "mongodb+srv://anmolmadaan:1i4UDEWLh1ZeR1p5@node.dl8r0.mongodb.net/friends"
    )
}

module.exports = connectDB;

