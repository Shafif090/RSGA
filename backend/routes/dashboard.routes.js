const { Router } = require("express");
const prisma = require("../config/prisma.js");
const { authenticate } = require("../middleware/auth.middleware.js");
const { getDashboard } = require("../controllers/dashboard.controller.js");
const router = Router();


// GET /api/v1/dashboard/schedule
router.get("/schedule", async (req, res) => {
  try {
    const now = new Date();
    // Optional: personalize by user hub if authenticated
    let hubId = undefined;
    if (req.user && req.user.id) {
      const me = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { hubId: true },
      });
      hubId = me?.hubId || undefined;
    }

    const hubFilter = hubId
      ? { OR: [{ homeHubId: hubId }, { awayHubId: hubId }] }
      : {};

    const upcoming = await prisma.match.findMany({
      where: {
        ...hubFilter,
        scheduledAt: { gte: now },
        status: { not: "CANCELLED" },
      },
      orderBy: { scheduledAt: "asc" },
      take: 10,
      include: { homeHub: true, awayHub: true },
    });

    const recent = await prisma.match.findMany({
      where: { ...hubFilter, scheduledAt: { lt: now }, status: "COMPLETED" },
      orderBy: { scheduledAt: "desc" },
      take: 10,
      include: { homeHub: true, awayHub: true },
    });

    const formatDate = (d) =>
      d
        ? new Date(d).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "";

    return res.json({
      upcoming: upcoming.map((m) => ({
        teamA: m.homeHub.name,
        teamB: m.awayHub.name,
        date: formatDate(m.scheduledAt),
        time: new Date(m.scheduledAt).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
      })),
      recent: recent.map((m) => {
        const hasScore =
          typeof m.homeScore === "number" && typeof m.awayScore === "number";
        let status = "draw";
        if (hubId && hasScore) {
          const isHome = m.homeHubId === hubId;
          const diff = (m.homeScore || 0) - (m.awayScore || 0);
          if (diff === 0) status = "draw";
          else if ((isHome && diff > 0) || (!isHome && diff < 0))
            status = "won";
          else status = "lost";
        }
        return {
          teamA: m.homeHub.name,
          teamB: m.awayHub.name,
          result: hasScore ? `${m.homeScore}-${m.awayScore}` : "-",
          status,
        };
      }),
    });
  } catch (e) {
    res.status(500).json({ message: "Failed to load schedule" });
  }
});

// user-specific dashboard consolidated endpoint
router.get("/me", authenticate, getDashboard);


module.exports = router;
