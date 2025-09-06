const prisma = require("../config/prisma.js");
const { ADMIN_EMAILS } = require("../config/env.js");

const adminOnly = async (req, res, next) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { email: true },
    });
    const list = (ADMIN_EMAILS || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (user && list.includes(user.email.toLowerCase())) return next();
    return res.status(403).json({ message: "Admin access required" });
  } catch (e) {
    return res.status(500).json({ message: "Admin check failed" });
  }
};

module.exports = { adminOnly };
