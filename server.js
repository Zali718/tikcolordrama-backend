const express = require("express");
const cors = require("cors");
const dramas = require("./data/dramas.json");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// HOME TEST
app.get("/", (req, res) => {
  res.send("🎬 TikColorDrama API is running");
});

// GET ALL DRAMAS
app.get("/api/dramas", (req, res) => {
  res.json(dramas);
});

// GET SINGLE DRAMA BY ID
app.get("/api/dramas/:id", (req, res) => {
  const drama = dramas.find(d => d.id == req.params.id);
  if (!drama) {
    return res.status(404).json({ message: "Drama not found" });
  }
  res.json(drama);
});

// SERVER START
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
