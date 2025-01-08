require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app= express();
const config =require("./config.json")
const mongoose = require("mongoose")
mongoose.connect(config.connectionString);

const jwt =require("jsonwebtoken");
const {authenticateToken}= require("./utilities")

const User = require("./models/user.model");

app.use(express.json());
app.use(
    cors({
        origin:"*"
    })
);

app.get("/",(req,res)=>{
    res.json({data:"Hello World"}); 
});

app.post("/create-account", async(req,res)=>{
    const {fullName, email, password} =req.body;
    if(!fullName) {
        return res
        .status(400)
        .json({error: true, message: "Full name is required"});

    }
    if(!email) {
        return res
        .status(400)
        .json({error: true, message : "Email is required"});
    }
    if(!password){
        return res 
        .status(400)
        .json({error: true, message : "Passowrd Reqiuired"})
    }
    const isUser =await User.findOne({ email:email});
    if(isUser){
        return res.json({
            error: true,
            message: "User Already There",
        });
      
    }
    const user =new User({
        fullName,
        email,
        password,
    });
    await user.save();

    const accessToken = jwt.sign({User}, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: "30000m"
    });
    return res.json({
        error: false,
        user,
        accessToken,
        message: "Account Creation Successful", 

    });
});

app.listen(8001);
module.exports = app;