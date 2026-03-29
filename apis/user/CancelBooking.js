const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function CancelBooking(req, res) {
  try {
    const user = req.session.user;
    if (!user || !user.isAuth || user.session.role !== "User") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { booking_id } = req.body;

    if (!booking_id || !ObjectId.isValid(booking_id)) {
      return res.status(400).json({ success: false, message: "Valid booking ID is required" });
    }

    const db = await connectDB();
    const bookingCollection = db.collection("bookings");
    const slotCollection = db.collection("game_slots");
    const seatCollection = db.collection("seats");

    const booking = await bookingCollection.findOne({
      _id: new ObjectId(booking_id),
      user_id: new ObjectId(user.session._id),
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({ success: false, message: "Booking is already cancelled" });
    }

    // Cancel booking
    await bookingCollection.updateOne(
      { _id: new ObjectId(booking_id) },
      { $set: { status: "Cancelled", updated_at: new Date() } }
    );

    // Restore slot to Available
    await slotCollection.updateOne(
      { _id: booking.slot_id },
      { $set: { status: "Available" } }
    );

    // Restore seat to Available
    await seatCollection.updateOne(
      { _id: booking.seat_id },
      { $set: { status: "Available" } }
    );

    return res.status(200).json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("CancelBooking.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { CancelBooking };
