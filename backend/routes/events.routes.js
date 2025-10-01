const { Router } = require("express");
const prisma = require("../config/prisma.js");

const router = Router();

// list events (upcoming first, then past)
router.get("/", async (_req, res) => {
  try {
    const now = new Date();
    const events = await prisma.event.findMany({
      orderBy: { scheduledAt: "asc" },
    });
    res.json({ events });
  } catch (e) {
    res.status(500).json({ message: "Failed to load events" });
  }
});

module.exports = router;
