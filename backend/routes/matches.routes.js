const { Router } = require("express");
const prisma = require("../config/prisma.js");
const { authenticate } = require("../middleware/auth.middleware.js");

const router = Router();

// All routes protected for now
router.use(authenticate);

// GET /api/v1/matches?status=SCHEDULED|COMPLETED&limit=20
router.get("/", async (req, res) => {
  try {
    const { status, limit } = req.query;
    const where = {};
    if (status) where.status = status;
    const matches = await prisma.match.findMany({
      where,
      orderBy: { scheduledAt: "desc" },
      take: Math.min(parseInt(limit || 20, 10) || 20, 100),
      include: { homeHub: true, awayHub: true },
    });
    res.json({
      matches: matches.map((m) => ({
        id: m.id,
        teamA: m.homeHub.name,
        teamB: m.awayHub.name,
        scheduledAt: m.scheduledAt,
        status: m.status,
        homeScore: m.homeScore,
        awayScore: m.awayScore,
      })),
    });
  } catch (e) {
    res.status(500).json({ message: "Failed to load matches" });
  }
});

module.exports = router;
