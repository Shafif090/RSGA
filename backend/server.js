require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();

const PORT = Number(process.env.PORT) || 5500;

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.FRONTEND_ORIGIN,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(morgan("dev"));
app.use(cors(corsOptions));
// Explicit preflight handler for all routes
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/users", require("./routes/user.routes.js"));
app.use("/api/v1/dashboard", require("./routes/dashboard.routes.js"));
app.use("/api/v1/leaderboard", require("./routes/leaderboard.routes.js"));
app.use("/api/v1/matches", require("./routes/matches.routes.js"));
app.use("/api/v1/events", require("./routes/events.routes.js"));
app.use("/api/v1/admin", require("./routes/admin.routes.js"));

// 404 fallback (JSON)
app.use((_req, res) => res.status(404).json({ message: "Not Found" }));

// Guard against double start in some environments
if (!app.locals.started) {
  app.locals.started = true;
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
    console.log(
      `CORS allowed origin: ${
        process.env.FRONTEND_ORIGIN || "http://localhost:3000"
      }`
    );
  });
}

module.exports = app;
