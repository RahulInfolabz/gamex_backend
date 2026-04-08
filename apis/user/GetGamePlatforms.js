const connectDB = require("../../db/dbConnect");

async function GetGamePlatforms(req, res) {
  try {
    const db = await connectDB();
    const platforms = await db.collection("games").distinct("platform", { status: "Active" });
    platforms.sort();
    return res.status(200).json({ success: true, message: "Game platforms fetched successfully", data: platforms });
  } catch (error) {
    console.error("GetGamePlatforms.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { GetGamePlatforms };
