const { Router } = require("express");
const prisma = require("../config/prisma.js");
const { authenticate } = require("../middleware/auth.middleware.js");
const { adminOnly } = require("../middleware/admin.middleware.js");

const router = Router();

router.use(authenticate, adminOnly);

// Summary
router.get("/summary", async (_req, res) => {
  try {
    const [users, hubs, matches] = await Promise.all([
      prisma.user.count(),
      prisma.hub.count(),
      prisma.match.count(),
    ]);
    res.json({ users, hubs, matches });
  } catch (e) {
    res.status(500).json({ message: "Failed to load summary" });
  }
});

// Hubs CRUD
router.get("/hubs", async (_req, res) => {
  const hubs = await prisma.hub.findMany({ orderBy: { name: "asc" } });
  res.json({ hubs });
});
router.post("/hubs", async (req, res) => {
  const { name, type, location, capacity } = req.body;
  const hub = await prisma.hub.create({
    data: { name, type, location, capacity: capacity ?? 30 },
  });
  res.status(201).json({ hub });
});
router.put("/hubs/:id", async (req, res) => {
  const { id } = req.params;
  const { name, type, location, capacity } = req.body;
  const hub = await prisma.hub.update({
    where: { id },
    data: { name, type, location, capacity },
  });
  res.json({ hub });
});
router.delete("/hubs/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.hub.delete({ where: { id } });
  res.json({ ok: true });
});

// Matches CRUD
router.get("/matches", async (_req, res) => {
  const matches = await prisma.match.findMany({
    include: { homeHub: true, awayHub: true },
    orderBy: { scheduledAt: "desc" },
  });
  res.json({ matches });
});
router.post("/matches", async (req, res) => {
  const {
    homeHubId,
    awayHubId,
    scheduledAt,
    status,
    homeScore,
    awayScore,
    resultNote,
  } = req.body;
  const match = await prisma.match.create({
    data: {
      homeHubId,
      awayHubId,
      scheduledAt: new Date(scheduledAt),
      status,
      homeScore,
      awayScore,
      resultNote,
    },
  });
  res.status(201).json({ match });
});
router.put("/matches/:id", async (req, res) => {
  const { id } = req.params;
  const {
    homeHubId,
    awayHubId,
    scheduledAt,
    status,
    homeScore,
    awayScore,
    resultNote,
  } = req.body;
  const match = await prisma.match.update({
    where: { id },
    data: {
      homeHubId,
      awayHubId,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      status,
      homeScore,
      awayScore,
      resultNote,
    },
  });
  res.json({ match });
});
router.delete("/matches/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.match.delete({ where: { id } });
  res.json({ ok: true });
});

// Events CRUD
router.get("/events", async (_req, res) => {
  const events = await prisma.event.findMany({
    orderBy: { scheduledAt: "desc" },
  });
  res.json({ events });
});
router.post("/events", async (req, res) => {
  const { title, subtitle, date, time, location, prize } = req.body;
  const scheduledAt = new Date(`${date}T${time}`);
  const event = await prisma.event.create({
    data: { title, subtitle, scheduledAt, location, prize },
  });
  res.status(201).json({ event });
});
router.put("/events/:id", async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, date, time, location, prize } = req.body;
  const scheduledAt = date && time ? new Date(`${date}T${time}`) : undefined;
  const event = await prisma.event.update({
    where: { id },
    data: { title, subtitle, scheduledAt, location, prize },
  });
  res.json({ event });
});
router.delete("/events/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.event.delete({ where: { id } });
  res.json({ ok: true });
});

// Users list + update stats
router.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany({
    include: { hub: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ users });
});
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const {
    fullName,
    email,
    phoneNumber,
    hubId,
    communities,
    games,
    totalGoals,
    totalAssists,
    totalAppearances,
    yellowCards,
    redCards,
    verified,
  } = req.body;
  const user = await prisma.user.update({
    where: { id },
    data: {
      fullName,
      email,
      phoneNumber,
      hubId,
      communities,
      games,
      totalGoals,
      totalAssists,
      totalAppearances,
      yellowCards,
      redCards,
      verified,
    },
  });
  res.json({ user });
});

module.exports = router;
