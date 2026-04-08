const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = "gamezone_platform";

async function seed() {
  const client = await MongoClient.connect(MONGO_URI);
  const db = client.db(DB_NAME);

  console.log("🌱 Starting seed...");

  await db.collection("users").deleteMany({});
  await db.collection("games").deleteMany({});
  await db.collection("game_slots").deleteMany({});
  await db.collection("seats").deleteMany({});
  await db.collection("bookings").deleteMany({});
  await db.collection("payments").deleteMany({});
  await db.collection("feedbacks").deleteMany({});

  console.log("🗑️  Cleared existing collections");

  // ── Users ─────────────────────────────────────────────────────────────────
  const usersResult = await db.collection("users").insertMany([
    {
      name: "Admin User",
      email: "admin@gamezone.com",
      phone: "9900000001",
      address: "Game Zone HQ, Ahmedabad",
      password: "Admin@123",
      profile_image: "",
      role: "Admin",
      status: "Active",
      created_at: new Date(),
    },
    {
      name: "Aryan Patel",
      email: "aryan@gmail.com",
      phone: "9900000002",
      address: "Satellite, Ahmedabad",
      password: "Aryan@123",
      profile_image: "",
      role: "User",
      status: "Active",
      created_at: new Date(),
    },
    {
      name: "Diya Shah",
      email: "diya@gmail.com",
      phone: "9900000003",
      address: "Bodakdev, Ahmedabad",
      password: "Diya@123",
      profile_image: "",
      role: "User",
      status: "Active",
      created_at: new Date(),
    },
  ]);

  const userIds = Object.values(usersResult.insertedIds);
  console.log("✅ Users seeded");

  // ── Games (with category, platform, type, min_players, max_players, age_limit) ──
  const gamesResult = await db.collection("games").insertMany([
    {
      name: "VR Shooting",
      description: "Virtual reality shooting game with immersive 3D environments. Experience the thrill of combat in a fully virtual world.",
      image: "",
      category: "Virtual Reality",
      platform: "VR Headset",
      type: "Single Player",
      min_players: 1,
      max_players: 1,
      age_limit: 12,
      status: "Active",
      created_at: new Date(),
    },
    {
      name: "Racing Simulator",
      description: "High-performance racing simulator with realistic car physics, multiple tracks, and head-to-head multiplayer mode.",
      image: "",
      category: "Simulation",
      platform: "Console",
      type: "Multiplayer",
      min_players: 1,
      max_players: 4,
      age_limit: 8,
      status: "Active",
      created_at: new Date(),
    },
    {
      name: "Bowling Alley",
      description: "Classic bowling experience with premium lanes, automatic pin setting, and score tracking system.",
      image: "",
      category: "Sports",
      platform: "Physical",
      type: "Multiplayer",
      min_players: 1,
      max_players: 6,
      age_limit: 5,
      status: "Active",
      created_at: new Date(),
    },
    {
      name: "Laser Tag Arena",
      description: "Team-based laser tag battle in a specially designed arena with obstacles, fog effects, and live score tracking.",
      image: "",
      category: "Adventure",
      platform: "Physical",
      type: "Team",
      min_players: 4,
      max_players: 20,
      age_limit: 8,
      status: "Active",
      created_at: new Date(),
    },
    {
      name: "Air Hockey",
      description: "Fast-paced air hockey tables with electronic scoring and tournament mode for competitive players.",
      image: "",
      category: "Arcade",
      platform: "Physical",
      type: "Multiplayer",
      min_players: 2,
      max_players: 2,
      age_limit: 5,
      status: "Active",
      created_at: new Date(),
    },
    {
      name: "4D Motion Cinema",
      description: "Immersive 4D cinema experience with motion seats, wind effects, and surround sound for thrilling short films.",
      image: "",
      category: "Cinema",
      platform: "Mixed",
      type: "Single Player",
      min_players: 1,
      max_players: 20,
      age_limit: 6,
      status: "Active",
      created_at: new Date(),
    },
  ]);

  const gameIds = Object.values(gamesResult.insertedIds);
  console.log("✅ Games seeded");

  // ── Slots ─────────────────────────────────────────────────────────────────
  const slotsResult = await db.collection("game_slots").insertMany([
    // VR Shooting slots
    { game_id: gameIds[0], slot_time_start: "10:00 AM", slot_time_end: "11:00 AM", duration: 60, price: 350, status: "Booked",     created_at: new Date() },
    { game_id: gameIds[0], slot_time_start: "11:00 AM", slot_time_end: "12:00 PM", duration: 60, price: 350, status: "Available",  created_at: new Date() },
    { game_id: gameIds[0], slot_time_start: "02:00 PM", slot_time_end: "03:00 PM", duration: 60, price: 350, status: "Available",  created_at: new Date() },
    // Racing Simulator slots
    { game_id: gameIds[1], slot_time_start: "10:00 AM", slot_time_end: "10:30 AM", duration: 30, price: 200, status: "Booked",     created_at: new Date() },
    { game_id: gameIds[1], slot_time_start: "11:00 AM", slot_time_end: "11:30 AM", duration: 30, price: 200, status: "Available",  created_at: new Date() },
    { game_id: gameIds[1], slot_time_start: "03:00 PM", slot_time_end: "03:30 PM", duration: 30, price: 200, status: "Available",  created_at: new Date() },
    // Bowling slots
    { game_id: gameIds[2], slot_time_start: "10:00 AM", slot_time_end: "11:00 AM", duration: 60, price: 250, status: "Available",  created_at: new Date() },
    { game_id: gameIds[2], slot_time_start: "12:00 PM", slot_time_end: "01:00 PM", duration: 60, price: 250, status: "Available",  created_at: new Date() },
    // Laser Tag slots
    { game_id: gameIds[3], slot_time_start: "04:00 PM", slot_time_end: "05:00 PM", duration: 60, price: 400, status: "Available",  created_at: new Date() },
    { game_id: gameIds[3], slot_time_start: "05:00 PM", slot_time_end: "06:00 PM", duration: 60, price: 400, status: "Available",  created_at: new Date() },
  ]);

  const slotIds = Object.values(slotsResult.insertedIds);
  console.log("✅ Slots seeded");

  // ── Seats ─────────────────────────────────────────────────────────────────
  const seatsResult = await db.collection("seats").insertMany([
    { game_id: gameIds[0], seat_no: "VR-A1", status: "Booked",    created_at: new Date() },
    { game_id: gameIds[0], seat_no: "VR-A2", status: "Available", created_at: new Date() },
    { game_id: gameIds[0], seat_no: "VR-A3", status: "Available", created_at: new Date() },
    { game_id: gameIds[0], seat_no: "VR-A4", status: "Available", created_at: new Date() },
    { game_id: gameIds[1], seat_no: "RC-01", status: "Booked",    created_at: new Date() },
    { game_id: gameIds[1], seat_no: "RC-02", status: "Available", created_at: new Date() },
    { game_id: gameIds[1], seat_no: "RC-03", status: "Available", created_at: new Date() },
    { game_id: gameIds[2], seat_no: "BW-L1", status: "Available", created_at: new Date() },
    { game_id: gameIds[2], seat_no: "BW-L2", status: "Available", created_at: new Date() },
    { game_id: gameIds[2], seat_no: "BW-L3", status: "Available", created_at: new Date() },
    { game_id: gameIds[3], seat_no: "LT-R1", status: "Available", created_at: new Date() },
    { game_id: gameIds[3], seat_no: "LT-R2", status: "Available", created_at: new Date() },
    { game_id: gameIds[3], seat_no: "LT-B1", status: "Available", created_at: new Date() },
    { game_id: gameIds[3], seat_no: "LT-B2", status: "Available", created_at: new Date() },
    { game_id: gameIds[4], seat_no: "AH-T1", status: "Available", created_at: new Date() },
    { game_id: gameIds[4], seat_no: "AH-T2", status: "Available", created_at: new Date() },
    { game_id: gameIds[5], seat_no: "4D-A1", status: "Available", created_at: new Date() },
    { game_id: gameIds[5], seat_no: "4D-A2", status: "Available", created_at: new Date() },
    { game_id: gameIds[5], seat_no: "4D-B1", status: "Available", created_at: new Date() },
    { game_id: gameIds[5], seat_no: "4D-B2", status: "Available", created_at: new Date() },
  ]);

  const seatIds = Object.values(seatsResult.insertedIds);
  console.log("✅ Seats seeded");

  // ── Bookings ──────────────────────────────────────────────────────────────
  const bookingsResult = await db.collection("bookings").insertMany([
    {
      user_id: userIds[1],
      game_id: gameIds[0],
      slot_id: slotIds[0],
      seat_id: seatIds[0],
      date: new Date("2025-12-10T10:00:00"),
      status: "Booked",
      payment_status: "Success",
      amount: 350,
    },
    {
      user_id: userIds[2],
      game_id: gameIds[1],
      slot_id: slotIds[3],
      seat_id: seatIds[4],
      date: new Date("2025-12-12T10:00:00"),
      status: "Booked",
      payment_status: "Success",
      amount: 200,
    },
    {
      user_id: userIds[1],
      game_id: gameIds[2],
      slot_id: slotIds[6],
      seat_id: seatIds[7],
      date: new Date(),
      status: "Booked",
      payment_status: "Pending",
      amount: 250,
    },
  ]);

  const bookingIds = Object.values(bookingsResult.insertedIds);
  console.log("✅ Bookings seeded");

  // ── Payments ──────────────────────────────────────────────────────────────
  await db.collection("payments").insertMany([
    {
      booking_id: bookingIds[0], user_id: userIds[1], amount: 350,
      payment_type: "Razorpay", razorpay_order_id: "order_demo_001",
      razorpay_payment_id: "pay_demo_001", razorpay_signature: "sig_demo_001",
      status: "Success", date: new Date("2025-12-10T10:05:00"),
    },
    {
      booking_id: bookingIds[1], user_id: userIds[2], amount: 200,
      payment_type: "Razorpay", razorpay_order_id: "order_demo_002",
      razorpay_payment_id: "pay_demo_002", razorpay_signature: "sig_demo_002",
      status: "Success", date: new Date("2025-12-12T10:05:00"),
    },
  ]);
  console.log("✅ Payments seeded");

  // ── Feedbacks ─────────────────────────────────────────────────────────────
  await db.collection("feedbacks").insertMany([
    {
      user_id: userIds[1], booking_id: bookingIds[0], rating: 5.0,
      feedback: "VR Shooting was absolutely amazing! The graphics were stunning and the experience was very immersive.",
      datetime: new Date("2025-12-10T12:00:00"),
    },
    {
      user_id: userIds[2], booking_id: bookingIds[1], rating: 4.5,
      feedback: "Racing Simulator was great fun! Very realistic feel. Would love more track options in the future.",
      datetime: new Date("2025-12-12T11:30:00"),
    },
  ]);
  console.log("✅ Feedbacks seeded");

  console.log("\n🎉 Seed completed successfully!");
  console.log("──────────────────────────────────────────");
  console.log("👤 Admin   → admin@gamezone.com  / Admin@123");
  console.log("👤 User 1  → aryan@gmail.com     / Aryan@123");
  console.log("👤 User 2  → diya@gmail.com      / Diya@123");
  console.log("──────────────────────────────────────────");
  console.log("\n🎮 Game Categories : Virtual Reality, Simulation, Sports, Adventure, Arcade, Cinema");
  console.log("💻 Game Platforms  : VR Headset, Console, Physical, Mixed");
  console.log("👥 Game Types      : Single Player, Multiplayer, Team");

  await client.close();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
