const fs = require("fs");
const path = require("path");

// ADMIN PANEL STATIC
app.use("/admin", express.static("public"));

// ADD EPISODE API
app.post("/api/add-episode", (req, res) => {
  const { dramaId, ep, title, video } = req.body;

  const filePath = path.join(__dirname, "data", "dramas.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const drama = data.find(d => d.id == dramaId);
  if (!drama) {
    return res.status(404).json({ error: "Drama not found" });
  }

  drama.episodes.push({
    ep: Number(ep),
    title,
    video
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.json({ success: true, message: "Episode added successfully" });
});
