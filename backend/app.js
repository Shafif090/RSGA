require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();

const ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
const corsOptions = {
  origin: ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

// Middleware
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // preflight
app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// Routes
app.use("/api/v1/auth", require("./routes/auth.routes.js"));
app.use("/api/v1/users", require("./routes/user.routes.js"));
app.use("/api/v1/dashboard", require("./routes/dashboard.routes.js"));
app.use("/api/v1/leaderboard", require("./routes/leaderboard.routes.js"));

app.get("/", (req, res) => {
  res.send("Backend is running");
});

// 404 JSON fallback
app.use((_req, res) => res.status(404).json({ message: "Not Found" }));

module.exports = app;
