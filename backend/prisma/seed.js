import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Upsert Games
  const games = [
    { name: "Minecraft", type: "ESPORTS" },
    { name: "FC Mobile", type: "ESPORTS" },
    { name: "Valorant", type: "ESPORTS" },
    { name: "Futsal", type: "OUTDOOR" },
  ];

  const gameRecords = {};
  for (const g of games) {
    const game = await prisma.game.upsert({
      where: { name: g.name },
      update: { type: g.type },
      create: { name: g.name, type: g.type },
    });
    gameRecords[g.name] = game;
  }

  // Upsert Hubs
  const hubs = [
    // Outdoor hubs (by location)
    {
      name: "Dhanmondi Axis",
      type: "OUTDOOR",
      location: "Dhaka - Dhanmondi",
      capacity: 40,
      gameId: gameRecords["Futsal"].id,
    },
    {
      name: "Uttara Axis",
      type: "OUTDOOR",
      location: "Dhaka - Uttara",
      capacity: 40,
      gameId: gameRecords["Futsal"].id,
    },
    // Esports hubs (by game)
    {
      name: "Minecraft Hub 1",
      type: "ESPORTS",
      location: "Online",
      capacity: 30,
      gameId: gameRecords["Minecraft"].id,
    },
    {
      name: "FC Mobile Hub 1",
      type: "ESPORTS",
      location: "Online",
      capacity: 30,
      gameId: gameRecords["FC Mobile"].id,
    },
    {
      name: "Valorant Hub 1",
      type: "ESPORTS",
      location: "Online",
      capacity: 30,
      gameId: gameRecords["Valorant"].id,
    },
  ];

  for (const h of hubs) {
    await prisma.hub.upsert({
      where: { type_name: { type: h.type, name: h.name } },
      update: { location: h.location, capacity: h.capacity, gameId: h.gameId },
      create: {
        name: h.name,
        type: h.type,
        location: h.location,
        capacity: h.capacity,
        gameId: h.gameId,
      },
    });
  }

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
