const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function BookSeat(req, res) {
  try {
    const user = req.session.user;
    if (!user || !user.isAuth || user.session.role !== "User") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { game_id, slot_id, seat_id } = req.body;

    if (!game_id || !slot_id || !seat_id) {
      return res.status(400).json({
        success: false,
        message: "Game ID, slot ID and seat ID are required",
      });
    }

    if (!ObjectId.isValid(game_id) || !ObjectId.isValid(slot_id) || !ObjectId.isValid(seat_id)) {
      return res.status(400).json({ success: false, message: "Invalid ID provided" });
    }

    const db = await connectDB();
    const gameCollection = db.collection("games");
    const slotCollection = db.collection("game_slots");
    const seatCollection = db.collection("seats");
    const bookingCollection = db.collection("bookings");

    // Verify game exists and is active
    const game = await gameCollection.findOne({ _id: new ObjectId(game_id), status: "Active" });
    if (!game) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }

    // Verify slot is available
    const slot = await slotCollection.findOne({
      _id: new ObjectId(slot_id),
      game_id: new ObjectId(game_id),
      status: "Available",
    });
    if (!slot) {
      return res.status(400).json({ success: false, message: "Slot is not available" });
    }

    // Verify seat is available
    const seat = await seatCollection.findOne({
      _id: new ObjectId(seat_id),
      game_id: new ObjectId(game_id),
      status: "Available",
    });
    if (!seat) {
      return res.status(400).json({ success: false, message: "Seat is not available" });
    }

    // Create booking
    await bookingCollection.insertOne({
      user_id: new ObjectId(user.session._id),
      game_id: new ObjectId(game_id),
      slot_id: new ObjectId(slot_id),
      seat_id: new ObjectId(seat_id),
      date: new Date(),
      status: "Booked",
      payment_status: "Pending",
      amount: slot.price,
    });

    // Mark slot as Booked
    await slotCollection.updateOne(
      { _id: new ObjectId(slot_id) },
      { $set: { status: "Booked" } }
    );

    // Mark seat as Booked
    await seatCollection.updateOne(
      { _id: new ObjectId(seat_id) },
      { $set: { status: "Booked" } }
    );

    return res.status(201).json({
      success: true,
      message: "Seat reserved successfully",
    });
  } catch (error) {
    console.error("BookSeat.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { BookSeat };
