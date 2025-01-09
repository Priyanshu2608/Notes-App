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
const Note = require("./models/note.model")

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

    const accessToken = jwt.sign({ User }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30m",
    });
    
    return res.json({
        error: false,
        user,
        accessToken,
        message: "Account Creation Successful", 

    });
});

app.post("/login", async(req,res)=>{
    const{email, password} =req.body;

    if(!email) {
        return res
        .status(400)
        .json({message: " Enter Email"})

    }

    if (!password){
        return res
        .status(400)
        .json({message : "Your Password"})
    }

    const userInfo = await User.findOne({email:email});

    if(!userInfo){
        return res
        .status(400)
        .json({message: "User not found"})
    }
    if (userInfo.email == email && userInfo.password == password){
        const user = { user : userInfo};
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "30000m"
        });
        return res.json({
            error:false,
            message:"Login successful",
            email,
            accessToken,
        });

    } else{
        return res.status(400).json({
            error:true,
            message: "Invalid Credentials",
        });
    }
});

app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const { user } = req.user; // `req.user` should come from `authenticateToken`

    if (!title) {
        return res.status(400).json({ error: true, message: "Title is empty" });
    }
    if (!content) {
        return res.status(400).json({ error: true, message: "Content is empty" });
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
        });
        await note.save();
        return res.json({
            error: false,
            note,
            message: "Note added successfully",
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});


app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user; // `req.user` should come from `authenticateToken`

    if (!title && !content && !tags) {
        return res.status(400).json({ error: true, message: "No changes made" });
    }

    try {
        // Find the note by ID and user ID
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        // Update the fields if provided
        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned !== undefined) note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});



app.listen(8001);
module.exports = app;