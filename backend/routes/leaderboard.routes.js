const { Router } = require("express");
const prisma = require("../config/prisma.js");
const { authenticate } = require("../middleware/auth.middleware.js");

const leaderboardRouter = Router();

// GET /api/v1/leaderboard
leaderboardRouter.get("/", authenticate, async (req, res) => {
  try {
    // Get top 10 users by points (totalGoals + totalAssists as example)
    const users = await prisma.user.findMany({
      orderBy: [{ totalGoals: "desc" }, { totalAssists: "desc" }],
      take: 10,
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        totalGoals: true,
        totalAssists: true,
        totalAppearances: true,
        yellowCards: true,
        redCards: true,
      },
    });

    // Add rank and points
    const leaderboard = users.map((user, idx) => ({
      rank: idx + 1,
      id: user.id,
      name: user.fullName,
      avatar: user.avatarUrl,
      goals: user.totalGoals,
      assists: user.totalAssists,
      appearances: user.totalAppearances,
      yellowCards: user.yellowCards,
      redCards: user.redCards,
      points: user.totalGoals + user.totalAssists * 2,
    }));

    res.json({ leaderboard });
  } catch (e) {
    res.status(500).json({ message: "Failed to load leaderboard" });
  }
});

module.exports = leaderboardRouter;
