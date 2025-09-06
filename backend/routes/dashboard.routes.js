const { Router } = require("express");
const router = Router();

// GET /api/v1/dashboard/stats
// Removed performance analytics endpoint

// GET /api/v1/dashboard/schedule
router.get("/schedule", (_req, res) => {
  return res.json({
    upcoming: [
      { teamA: "TEAM A", teamB: "TEAM D", date: "Dec 15", time: "3:00 PM" },
      { teamA: "TEAM D", teamB: "TEAM C", date: "Dec 18", time: "4:30 PM" },
    ],
    recent: [
      { teamA: "TEAM A", teamB: "TEAM D", result: "2-1", status: "won" },
      { teamA: "TEAM D", teamB: "TEAM C", result: "0-2", status: "lost" },
    ],
  });
});

module.exports = router;
