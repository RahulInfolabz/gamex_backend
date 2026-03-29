const connectDB = require("../../db/dbConnect");

async function AddGame(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ success: false, message: "Name and description are required" });
    }

    const db = await connectDB();
    const image = req.file ? `/uploads/games/${req.file.filename}` : "";

    await db.collection("games").insertOne({
      name,
      description,
      image,
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
