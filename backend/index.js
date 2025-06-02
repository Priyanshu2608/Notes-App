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

// CORS configuration
app.use(cors({
  origin: "https://notes-app-rsfw.onrender.com",
  credentials: true
}));

// MongoDB connection
const connectionString = process.env.MONGO_URI;
mongoose
  .connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection failed:", err));

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// Routes
app.get("/", (req, res) => {
  res.json({ data: "Hello World" });
});

// Create account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) return res.status(400).json({ error: true, message: "Full name is required" });
  if (!email) return res.status(400).json({ error: true, message: "Email is required" });
  if (!password) return res.status(400).json({ error: true, message: "Password is required" });

  try {
    const isUser = await User.findOne({ email });
    if (isUser) return res.status(400).json({ error: true, message: "User already exists" });

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ fullName, email, password: hashedPassword });
    await user.save();

    const accessToken = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
    return res.json({ error: false, user, accessToken, message: "Account created successfully" });
  } catch (err) {
    console.error("Error creating account:", err);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ error: true, message: "Email is required" });
  if (!password) return res.status(400).json({ error: true, message: "Password is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: true, message: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: true, message: "Invalid credentials" });
    }

    const accessToken = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
    return res.json({ error: false, accessToken, message: "Login successful" });
  } catch (err) {
    console.error("Error logging in:", err);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Get all notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const userId = req.user._id;

  try {
    const notes = await Note.find({ userId }).sort({ isPinned: -1 });
    return res.json({ error: false, notes, message: notes.length ? "Notes retrieved" : "No notes found" });
  } catch (err) {
    console.error("Error fetching notes:", err);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Get user details
app.get("/get-user", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    const isUser = await User.findOne({ _id: userId });
    if (!isUser) {
      return res.status(401).json({ error: true, message: "User not found" });
    }

    return res.json({
      error: false,
      user: { fullName: isUser.fullName, email: isUser.email, _id: isUser._id, createdOn: isUser.createdOn },
      message: "User retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Add note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const userId = req.user._id;

  if (!title) return res.status(400).json({ error: true, message: "Title is required" });
  if (!content) return res.status(400).json({ error: true, message: "Content is required" });

  try {
    const note = new Note({ title, content, tags: tags || [], userId });
    await note.save();
    return res.json({ error: false, note, message: "Note added successfully" });
  } catch (err) {
    console.error("Error adding note:", err);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Edit note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const { noteId } = req.params;
  const { title, content, tags, isPinned } = req.body;
  const userId = req.user._id;

  try {
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) return res.status(404).json({ error: true, message: "Note not found" });

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;

    await note.save();
    return res.json({ error: false, note, message: "Note updated successfully" });
  } catch (err) {
    console.error("Error updating note:", err);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Delete note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user._id;

  try {
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) return res.status(404).json({ error: true, message: "Note not found" });

    await Note.deleteOne({ _id: noteId });
    return res.json({ error: false, message: "Note deleted successfully" });
  } catch (err) {
    console.error("Error deleting note:", err);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Update note pinned status
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const { noteId } = req.params;
  const { isPinned } = req.body;
  const userId = req.user._id;

  try {
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) return res.status(404).json({ error: true, message: "Note not found" });

    note.isPinned = isPinned;

    await note.save();
    return res.json({ error: false, note, message: "Note updated successfully" });
  } catch (err) {
    console.error("Error updating note:", err);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Search notes
app.get("/search-notes", authenticateToken, async (req, res) => {
  const userId = req.user._id;
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: true, message: "Search query is required" });
  }

  try {
    const matchingNotes = await Note.find({
      userId,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    return res.json({
      error: false,
      notes: matchingNotes,
      message: "Notes matching the search query retrieved successfully",
    });
  } catch (error) {
    console.error("Error searching notes:", error);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Start server
app.listen(8001, () => console.log("Server running on port 8001"));

module.exports = app;
