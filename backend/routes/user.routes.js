const { Router } = require("express");
const { authenticate } = require("../middleware/auth.middleware.js");

const userRouter = Router();

// Public routes
userRouter.post("/", (req, res) => res.send({ title: "create new user" }));

// Protected routes
userRouter.use(authenticate);

// Dashboard route (must be before /:id)
const prisma = require("../config/prisma.js");
userRouter.get("/me", async (req, res) => {
userRouter.get("/", (req, res) => res.send({ title: "GET all users" }));
userRouter.get("/:id", (req, res) => res.send({ title: "GET user details" }));
userRouter.put("/:id", (req, res) => res.send({ title: "UPDATE user" }));
userRouter.delete("/:id", (req, res) => res.send({ title: "DELETE user" }));
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        userHubs: { include: { hub: true } },
        userGames: { include: { game: true } },
      },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Aggregate stats (mock for now, replace with real queries as needed)
    const stats = {
      rank: 6,
      points: { total: 2090 },
      games: user.userGames.map((ug) => ({ name: ug.game.name })),
      hubs: user.userHubs.map((uh) => ({ name: uh.hub.name })),
      badges: ["Strategist", "Team Player", "Rising Star"],
    };

    res.json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      school: user.school || "",
      bio: user.bio || "",
      avatar: user.avatarUrl || "",
      facebook: user.facebook || "",
      ...stats,
    });
  } catch (e) {
    res.status(500).json({ message: "Failed to load user info" });
  }
});

module.exports = userRouter;
