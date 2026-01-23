// ==============================
// tikcolordrama-backend - server.js
// ==============================

const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------------
// Admin credentials (Change this!)
const ADMIN_USER = "admin";
const ADMIN_PASS = "12365"; // Strong password recommended
// ------------------------------

// Serve static files
app.use("/admin", express.static("public"));

// ------------------------------
// Login API
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if(username === ADMIN_USER && password === ADMIN_PASS) {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "Invalid credentials" });
  }
});

// ------------------------------
// Add Episode API
app.post("/api/add-episode", (req, res) => {
  const { dramaId, ep, title, video } = req.body;

  if(!dramaId || !ep || !title || !video) {
    return res.status(400).json({ error: "All fields required" });
  }

  const filePath = path.join(__dirname, "data", "dramas.json");

  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err) {
    return res.status(500).json({ error: "Failed to read dramas.json" });
  }

  const drama = data.find(d => d.id == dramaId);
  if(!drama) return res.status(404).json({ error: "Drama not found" });

  drama.episodes.push({
    ep: Number(ep),
    title,
    video
  });

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.json({ success: true, message: "Episode added successfully" });
  } catch(err) {
    res.status(500).json({ error: "Failed to save dramas.json" });
  }
});

// ------------------------------
// Get all dramas API
app.get("/api/dramas", (req, res) => {
  const filePath = path.join(__dirname, "data", "dramas.json");
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    res.json(data);
  } catch(err) {
    res.status(500).json({ error: "Failed to read dramas.json" });
  }
});

// ------------------------------
// Get single drama by ID
app.get("/api/dramas/:id", (req, res) => {
  const filePath = path.join(__dirname, "data", "dramas.json");
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const drama = data.find(d => d.id == req.params.id);
    if(!drama) return res.status(404).json({ error: "Drama not found" });
    res.json(drama);
  } catch(err) {
    res.status(500).json({ error: "Failed to read dramas.json" });
  }
});

// ------------------------------
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
