require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authenticateToken } = require("./utilities");

const User = require("./models/user.model");
const Note = require("./models/note.model");

const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection failed:", err));

// Routes
app.get("/", (req, res) => {
  res.json({ data: "Hello World" });
});

// Signup Route
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) return res.status(400).json({ error: true, message: "Full name is required" });
  if (!email) return res.status(400).json({ error: true, message: "Email is required" });
  if (!password) return res.status(400).json({ error: true, message: "Password is required" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: true, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hashedPassword });
    await user.save();

    const accessToken = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });

    res.json({ error: false, user, accessToken, message: "Account created successfully" });
  } catch (err) {
    console.error("Error creating account:", err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ error: true, message: "Email is required" });
  if (!password) return res.status(400).json({ error: true, message: "Password is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: true, message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ error: true, message: "Invalid credentials" });

    const accessToken = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });

    res.json({ error: false, accessToken, message: "Login successful" });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Get User Info (Protected Route)
app.get("/get-user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("fullName email createdOn");
    if (!user) return res.status(404).json({ error: true, message: "User not found" });

    res.json({ error: false, user, message: "User retrieved successfully" });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Get Notes (Protected Route)
app.get("/get-notes", authenticateToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id });
    res.json({ error: false, notes, message: "Notes retrieved successfully" });
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Create Note (Protected Route)
app.post("/create-note", authenticateToken, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) return res.status(400).json({ error: true, message: "Title and content are required" });

  try {
    const note = new Note({ userId: req.user._id, title, content });
    await note.save();

    res.json({ error: false, note, message: "Note created successfully" });
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Server start
app.listen(8001, () => {
  console.log("Server is running on port 8001");
});
