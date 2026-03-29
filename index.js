const express = require("express");
const cors = require("cors");
const session = require("express-session");
const connectDB = require("./db/dbConnect");
require("dotenv").config();

// ── Multer Instances ──────────────────────────────────────────────────────────
const { gameUpload, profileUpload } = require("./multer/multer");

// ── Common APIs ───────────────────────────────────────────────────────────────
const Logout = require("./apis/common/logout");
const Session = require("./apis/common/session");
const { Login } = require("./apis/common/login");
const { Signup } = require("./apis/common/signup");
const { ChangePassword } = require("./apis/common/changePassword");

// ── Public APIs ───────────────────────────────────────────────────────────────
const { GetGames } = require("./apis/user/GetGames");
const { GetGameDetails } = require("./apis/user/GetGameDetails");
const { GetSlots } = require("./apis/user/GetSlots");
const { GetSeats } = require("./apis/user/GetSeats");
const { GetFeedbacks } = require("./apis/user/GetFeedbacks");

// ── User APIs ─────────────────────────────────────────────────────────────────
const { GetProfile } = require("./apis/user/GetProfile");
const { UpdateProfile } = require("./apis/user/UpdateProfile");
const { BookSeat } = require("./apis/user/BookSeat");
const { MyBookings } = require("./apis/user/MyBookings");
const { CancelBooking } = require("./apis/user/CancelBooking");
const { GenOrderId } = require("./apis/user/GenOrderId");
const { VerifyPayment } = require("./apis/user/VerifyPayment");
const { AddFeedback } = require("./apis/user/AddFeedback");

// ── Admin APIs ────────────────────────────────────────────────────────────────
const { GetUsers } = require("./apis/admin/GetUsers");
const { UpdateUserStatus } = require("./apis/admin/UpdateUserStatus");
const { AddGame } = require("./apis/admin/AddGame");
const { UpdateGame } = require("./apis/admin/UpdateGame");
const { DeleteGame } = require("./apis/admin/DeleteGame");
const { GetAdminGames } = require("./apis/admin/GetGames");
const { AddSlot } = require("./apis/admin/AddSlot");
const { UpdateSlot } = require("./apis/admin/UpdateSlot");
const { DeleteSlot } = require("./apis/admin/DeleteSlot");
const { GetAdminSlots } = require("./apis/admin/GetSlots");
const { AddSeat } = require("./apis/admin/AddSeat");
const { UpdateSeat } = require("./apis/admin/UpdateSeat");
const { DeleteSeat } = require("./apis/admin/DeleteSeat");
const { GetAdminSeats } = require("./apis/admin/GetSeats");
const { GetBookings } = require("./apis/admin/GetBookings");
const { UpdateBooking } = require("./apis/admin/UpdateBooking");
const { GetPayments } = require("./apis/admin/GetPayments");
const { GetAdminFeedbacks } = require("./apis/admin/GetFeedbacks");
const { DashboardStats } = require("./apis/admin/DashboardStats");

// ─────────────────────────────────────────────────────────────────────────────

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "gamezone_platform_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);


app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ── Static File Serving ───────────────────────────────────────────────────────
app.use("/uploads/games", express.static("uploads/games"));
app.use("/uploads/profiles", express.static("uploads/profiles"));

// ── DB Connect ────────────────────────────────────────────────────────────────
connectDB();

// ─────────────────────────────────────────────────────────────────────────────
//  COMMON APIs
// ─────────────────────────────────────────────────────────────────────────────
app.post("/signup", Signup);
app.post("/login", Login);
app.get("/logout", Logout);
app.get("/session", Session);
app.post("/changePassword", ChangePassword);

// ─────────────────────────────────────────────────────────────────────────────
//  PUBLIC APIs (no auth required)
// ─────────────────────────────────────────────────────────────────────────────
app.get("/games", GetGames);
app.get("/games/:id", GetGameDetails);
app.get("/slots/:game_id", GetSlots);
app.get("/seats/:game_id", GetSeats);
app.get("/feedbacks", GetFeedbacks);

// ─────────────────────────────────────────────────────────────────────────────
//  USER APIs (session required)
// ─────────────────────────────────────────────────────────────────────────────
app.get("/user/profile", GetProfile);
app.post("/user/updateProfile", profileUpload.single("profile_image"), UpdateProfile);
app.post("/user/bookSeat", BookSeat);
app.get("/user/myBookings", MyBookings);
app.post("/user/cancelBooking", CancelBooking);
app.post("/user/genOrderId", GenOrderId);
app.post("/user/verifyPayment", VerifyPayment);
app.post("/user/addFeedback", AddFeedback);

// ─────────────────────────────────────────────────────────────────────────────
//  ADMIN APIs (session required)
// ─────────────────────────────────────────────────────────────────────────────

// Users
app.get("/admin/users", GetUsers);
app.post("/admin/updateUserStatus", UpdateUserStatus);

// Games
app.post("/admin/addGame", gameUpload.single("image"), AddGame);
app.post("/admin/updateGame", gameUpload.single("image"), UpdateGame);
app.get("/admin/deleteGame/:id", DeleteGame);
app.get("/admin/games", GetAdminGames);

// Slots
app.post("/admin/addSlot", AddSlot);
app.post("/admin/updateSlot", UpdateSlot);
app.get("/admin/deleteSlot/:id", DeleteSlot);
app.get("/admin/slots", GetAdminSlots);

// Seats
app.post("/admin/addSeat", AddSeat);
app.post("/admin/updateSeat", UpdateSeat);
app.get("/admin/deleteSeat/:id", DeleteSeat);
app.get("/admin/seats", GetAdminSeats);

// Bookings
app.get("/admin/bookings", GetBookings);
app.post("/admin/updateBooking", UpdateBooking);

// Reports
app.get("/admin/payments", GetPayments);
app.get("/admin/feedbacks", GetAdminFeedbacks);
app.get("/admin/dashboardStats", DashboardStats);


app.get("/", (req, res) => {
  res.send("Welcome to GameX Platform API!");
});


// ─────────────────────────────────────────────────────────────────────────────
app.listen(PORT, () =>
  console.log(`✅ Game Zone Reservation server started on PORT ${PORT}!`)
);
