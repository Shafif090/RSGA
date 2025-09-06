const { Router } = require("express");
const { authenticate } = require("../middleware/auth.middleware.js");
const prisma = require("../config/prisma.js");

const userRouter = Router();

// Public routes
userRouter.post("/", (req, res) => res.send({ title: "create new user" }));

// Protected routes
userRouter.use(authenticate);

// Me route
userRouter.get("/me", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        hub: true,
      },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const response = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      school: user.school || "",
      bio: user.bio || "",
      avatar: user.avatarUrl || "",
      facebook: user.facebook || "",
      // Keep frontend-expected shape
      hubs: [{ name: user.hub?.name || "Unassigned" }],
      rank: 0, // optional, not used yet
      points: { total: user.totalGoals * 3 + user.totalAssists },
      badges: ["Member"],
      // Totals for dashboard UI
      totalGoals: user.totalGoals,
      totalAssists: user.totalAssists,
      totalAppearances: user.totalAppearances,
      yellowCards: user.yellowCards,
      redCards: user.redCards,
      communities: user.communities || [],
      games: user.games || [],
    };

    res.json(response);
  } catch (e) {
    res.status(500).json({ message: "Failed to load user info" });
  }
});

// Other protected user CRUD placeholders
userRouter.get("/", (req, res) => res.send({ title: "GET all users" }));
userRouter.get("/:id", (req, res) => res.send({ title: "GET user details" }));
userRouter.put("/:id", (req, res) => res.send({ title: "UPDATE user" }));
userRouter.delete("/:id", (req, res) => res.send({ title: "DELETE user" }));

module.exports = userRouter;
