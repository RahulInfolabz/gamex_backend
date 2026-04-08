const connectDB = require("../../db/dbConnect");

async function GetGames(req, res) {
  try {
    const { category, platform, type, min_players, max_players, age_limit } = req.query;

    const db = await connectDB();
    const matchStage = { status: "Active" };

    if (category)    matchStage.category    = { $regex: new RegExp(`^${category}$`, "i") };
    if (platform)    matchStage.platform    = { $regex: new RegExp(`^${platform}$`, "i") };
    if (type)        matchStage.type        = { $regex: new RegExp(`^${type}$`, "i") };
    if (min_players) matchStage.max_players = { $gte: parseInt(min_players) }; // game supports at least min_players
    if (max_players) matchStage.min_players = { ...(matchStage.min_players || {}), $lte: parseInt(max_players) };
    if (age_limit)   matchStage.age_limit   = { $lte: parseInt(age_limit) };

    const games = await db
      .collection("games")
      .find(matchStage)
      .sort({ name: 1 })
      .toArray();

    return res.status(200).json({
      success: true,
      message: "Games fetched successfully",
      data: games,
    });
  } catch (error) {
    console.error("GetGames.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { GetGames };
