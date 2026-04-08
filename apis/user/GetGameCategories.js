const connectDB = require("../../db/dbConnect");

async function GetGameCategories(req, res) {
  try {
    const db = await connectDB();
    const categories = await db.collection("games").distinct("category", { status: "Active" });
    categories.sort();
    return res.status(200).json({ success: true, message: "Game categories fetched successfully", data: categories });
  } catch (error) {
    console.error("GetGameCategories.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { GetGameCategories };
