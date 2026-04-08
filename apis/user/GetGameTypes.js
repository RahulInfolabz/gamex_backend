const connectDB = require("../../db/dbConnect");

async function GetGameTypes(req, res) {
  try {
    const db = await connectDB();
    const types = await db.collection("games").distinct("type", { status: "Active" });
    types.sort();
    return res.status(200).json({ success: true, message: "Game types fetched successfully", data: types });
  } catch (error) {
    console.error("GetGameTypes.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { GetGameTypes };
