const express = require("express");
const {
  register,
  login,
  verify,
  logout,
} = require("../controllers/auth.controller.js");

const router = express.Router();

router.options("/login", (_req, res) => res.sendStatus(204));
router.options("/register", (_req, res) => res.sendStatus(204));
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/verify/:token", verify);

module.exports = router;
