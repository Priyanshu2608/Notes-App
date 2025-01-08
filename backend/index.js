require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app= express();
const config =require("./config.json")
const mongoose = require("mongoose")
mongoose.connect(config.connectionString);

const jwt =require("jsonwebtoken");
const {authenticateToken}= require("./utilities")

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
})

app.listen(8000);
module.exports = app;