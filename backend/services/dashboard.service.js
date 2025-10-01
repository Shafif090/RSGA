const prisma = require("../config/prisma.js");

// Get user dashboard data
const getDashboardData = async (userId) => {
  // Get user data with hub
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      hub: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get upcoming matches for user's hub (home or away)
  const matches = await prisma.match.findMany({
    where: user.hubId
      ? {
          OR: [{ homeHubId: user.hubId }, { awayHubId: user.hubId }],
          scheduledAt: { gte: new Date() },
        }
      : { scheduledAt: { gte: new Date() } },
    orderBy: { scheduledAt: "asc" },
    include: { homeHub: true, awayHub: true },
    take: 5,
  });
  

  // Get leaderboard for user's hub
  const leaderboard = await prisma.user.findMany({
    where: { hubId: user.hubId },
    select: {
      id: true,
      fullName: true,
      totalGoals: true,
      totalAssists: true,
    },
    orderBy: {
      totalGoals: "desc",
    },
    take: 10,
  });

  return {
    user: {
      name: user.fullName,
      id: user.id,
      email: user.email,
      phone: user.phoneNumber,
      hub: user.hub?.name,
      school: user.school,
      grade: user.grade,
      section: user.section,
    },
    matches: matches.map((match) => ({
      teamA: match.homeHub.name,
      teamB: match.awayHub.name,
      date: match.scheduledAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      time: match.scheduledAt.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    })),
    stats,
    monthlyStats,
    leaderboard,
  };
};

module.exports = { getDashboardData };
