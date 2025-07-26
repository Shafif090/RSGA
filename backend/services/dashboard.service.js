import prisma from "../config/prisma.js";

// Get user dashboard data
export const getDashboardData = async (userId) => {
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

  // Get match schedule for user's hub
  const matches = await prisma.match.findMany({
    where: { hubId: user.hubId },
    orderBy: { date: "asc" },
    take: 5,
  });

  // Get user stats
  const stats = await prisma.stat.findMany({
    where: { userId },
    include: {
      match: {
        select: {
          date: true,
          teamA: true,
          teamB: true,
        },
      },
    },
    orderBy: {
      match: { date: "desc" },
    },
    take: 3,
  });

  // Get monthly stats for charts
  const monthlyStats = await prisma.$queryRaw`
    SELECT 
      TO_CHAR(m.date, 'Mon') as month,
      SUM(s.goals) as goals,
      SUM(s.assists) as assists,
      COUNT(s.id) as matches
    FROM stat s
    JOIN match m ON s.match_id = m.id
    WHERE s.user_id = ${userId}
      AND m.date >= NOW() - INTERVAL '12 months'
    GROUP BY month
    ORDER BY MIN(m.date)
  `;

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
      teamA: match.teamA,
      teamB: match.teamB,
      date: match.date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      time: match.time,
    })),
    stats: stats.map((stat) => ({
      matchDate: stat.match.date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      teamA: stat.match.teamA,
      teamB: stat.match.teamB,
      goals: stat.goals,
      assists: stat.assists,
      yellowCards: stat.yellowCards,
      redCards: stat.redCards,
      appearance: stat.appearance,
    })),
    monthlyStats: monthlyStats.map((stat) => ({
      month: stat.month,
      goals: Number(stat.goals),
      assists: Number(stat.assists),
      matches: Number(stat.matches),
    })),
    leaderboard,
  };
};
