const { Router } = require("express");
const {
  register,
  verify,
  login,
  logout,
} = require("../controllers/auth.controller.js");

const authRouter = Router();

// Explicit preflight (global app.options also covers it)
authRouter.options("/register", (_req, res) => res.sendStatus(204));

// POST /api/v1/auth/register
authRouter.post("/register", (req, res) => {
  const {
    fullName,
    email,
    phoneNumber,
    password,
    joinESports,
    joinOutdoor,
    esportsGames,
    outdoorGames,
  } = req.body || {};

  const errors = {};
  if (!fullName) errors.fullName = "Full name is required";
  if (!email) errors.email = "Email is required";
  if (!phoneNumber) errors.phoneNumber = "Phone number is required";
  if (!password || password.length < 8)
    errors.password = "Password must be at least 8 characters";
  if (!joinESports && !joinOutdoor)
    errors.community = "Select at least one community";
  if (
    joinESports &&
    (!Array.isArray(esportsGames) || esportsGames.length === 0)
  )
    errors.esportsGames = "Select at least one esports game";
  if (
    joinOutdoor &&
    (!Array.isArray(outdoorGames) || outdoorGames.length === 0)
  )
    errors.outdoorGames = "Select at least one outdoor option";

  if (Object.keys(errors).length) {
    return res.status(400).json({ errors });
  }

  // TODO: Persist user (Prisma + Supabase) and send verification email (409 on conflicts).
  return res
    .status(201)
    .json({ message: "Registered. Verify your email to continue." });
});


// Public routes
authRouter.get("/verify/:token", verify);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

module.exports = authRouter;
