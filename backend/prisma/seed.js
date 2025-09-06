const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function upsertHubs() {
  const hubs = [
    {
      name: "Dhanmondi Axis",
      type: "OUTDOOR",
      location: "Dhaka - Dhanmondi",
      capacity: 40,
    },
    {
      name: "Uttara Axis",
      type: "OUTDOOR",
      location: "Dhaka - Uttara",
      capacity: 40,
    },
    {
      name: "Minecraft Hub 1",
      type: "ESPORTS",
      location: "Online",
      capacity: 30,
    },
    {
      name: "FC Mobile Hub 1",
      type: "ESPORTS",
      location: "Online",
      capacity: 30,
    },
    {
      name: "Valorant Hub 1",
      type: "ESPORTS",
      location: "Online",
      capacity: 30,
    },
  ];
  const records = {};
  for (const h of hubs) {
    const rec = await prisma.hub.upsert({
      where: { type_name: { type: h.type, name: h.name } },
      update: { location: h.location, capacity: h.capacity },
      create: {
        name: h.name,
        type: h.type,
        location: h.location,
        capacity: h.capacity,
      },
    });
    records[`${h.type}:${h.name}`] = rec;
  }
  return records;
}

async function createUsers(hubs) {
  const password = await bcrypt.hash("Password123", 10);
  const sampleUsers = [
    {
      fullName: "Alice Ahmed",
      email: "alice@example.com",
      phoneNumber: "01700000001",
      hubKey: "OUTDOOR:Dhanmondi Axis",
      communities: ["OUTDOOR"],
      games: ["Football"],
    },
    {
      fullName: "Bashir Khan",
      email: "bashir@example.com",
      phoneNumber: "01700000002",
      hubKey: "OUTDOOR:Uttara Axis",
      communities: ["OUTDOOR"],
      games: ["Football"],
    },
    {
      fullName: "Chowdhury Rai",
      email: "chowdhury@example.com",
      phoneNumber: "01700000003",
      hubKey: "ESPORTS:Valorant Hub 1",
      communities: ["ESPORTS"],
      games: ["Valorant"],
    },
    {
      fullName: "Dipa Saha",
      email: "dipa@example.com",
      phoneNumber: "01700000004",
      hubKey: "ESPORTS:FC Mobile Hub 1",
      communities: ["ESPORTS"],
      games: ["FC Mobile"],
    },
    {
      fullName: "Ehsan Noor",
      email: "ehsan@example.com",
      phoneNumber: "01700000005",
      hubKey: "ESPORTS:Minecraft Hub 1",
      communities: ["ESPORTS"],
      games: ["Minecraft"],
    },
  ];

  const users = [];
  for (const u of sampleUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { verified: true, communities: u.communities, games: u.games },
      create: {
        fullName: u.fullName,
        email: u.email,
        phoneNumber: u.phoneNumber,
        password,
        verified: true,
        communities: u.communities,
        games: u.games,
      },
    });
    // Assign to hub directly
    const hub = hubs[u.hubKey];
    if (hub) {
      await prisma.user.update({
        where: { id: user.id },
        data: { hubId: hub.id },
      });
    }

    users.push(user);
  }
  return users;
}

async function createMatches(hubs) {
  const now = new Date();
  const days = (n) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);

  const matchesData = [
    {
      home: "OUTDOOR:Dhanmondi Axis",
      away: "OUTDOOR:Uttara Axis",
      scheduledAt: days(-5),
      status: "COMPLETED",
      homeScore: 2,
      awayScore: 1,
    },
    {
      home: "OUTDOOR:Uttara Axis",
      away: "OUTDOOR:Dhanmondi Axis",
      scheduledAt: days(-2),
      status: "COMPLETED",
      homeScore: 0,
      awayScore: 2,
    },
    {
      home: "ESPORTS:Valorant Hub 1",
      away: "ESPORTS:FC Mobile Hub 1",
      scheduledAt: days(2),
      status: "SCHEDULED",
    },
    {
      home: "ESPORTS:Minecraft Hub 1",
      away: "ESPORTS:Valorant Hub 1",
      scheduledAt: days(5),
      status: "SCHEDULED",
    },
  ];

  for (const m of matchesData) {
    const home = hubs[m.home];
    const away = hubs[m.away];
    if (!home || !away) continue;
    await prisma.match.create({
      data: {
        homeHubId: home.id,
        awayHubId: away.id,
        scheduledAt: m.scheduledAt,
        status: m.status,
        homeScore: typeof m.homeScore === "number" ? m.homeScore : null,
        awayScore: typeof m.awayScore === "number" ? m.awayScore : null,
      },
    });
  }
}

async function recomputeUserAggregates() {
  // No automatic recompute without participants; keep as no-op
  return;
}

async function createEvents() {
  const now = new Date();
  const toDate = (s) => new Date(s);
  const events = [
    {
      title: "Inter-School Football Championship",
      subtitle:
        "Annual championship featuring top schools from across the region competing for the ultimate trophy.",
      scheduledAt: toDate("2025-09-15T09:00:00"),
      location: "Central Sports Complex",
      prize: "$5,000",
    },
    {
      title: "Basketball Skills Workshop",
      subtitle:
        "Learn advanced basketball techniques from professional coaches and improve your game.",
      scheduledAt: toDate("2025-09-20T14:00:00"),
      location: "Indoor Basketball Court",
      prize: "Certificates",
    },
  ];
  for (const e of events) {
    await prisma.event.create({ data: e });
  }
}

async function main() {
  const hubs = await upsertHubs();
  const users = await createUsers(hubs);
  await createMatches(hubs);
  await recomputeUserAggregates();
  await createEvents();
  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
