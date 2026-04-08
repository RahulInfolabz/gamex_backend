const connectDB = require("../../db/dbConnect");

async function AddGame(req, res) {
  try {
    const { name, description, category, platform, type, min_players, max_players, age_limit } = req.body;

    if (!name || !description || !category || !platform || !type) {
      return res.status(400).json({ success: false, message: "Name, description, category, platform and type are required" });
    }

    const db = await connectDB();
    const image = req.file ? `/uploads/games/${req.file.filename}` : "";

    await db.collection("games").insertOne({
      name,
      description,
      image,
      category,        // e.g. Virtual Reality, Sports, Arcade, Adventure, Simulation, Cinema
      platform,        // e.g. Console, PC, VR Headset, Physical, Mixed
      type,            // e.g. Single Player, Multiplayer, Team
      min_players: min_players ? parseInt(min_players) : 1,
      max_players: max_players ? parseInt(max_players) : 1,
      age_limit: age_limit ? parseInt(age_limit) : 0,
      status: "Active",
      created_at: new Date(),
    });

    return res.status(201).json({ success: true, message: "Game added successfully" });
  } catch (error) {
    console.error("AddGame.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { AddGame };
