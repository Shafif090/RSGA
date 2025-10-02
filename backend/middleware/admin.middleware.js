const prisma = require("../config/prisma.js");

const adminOnly = async (req, res, next) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true },
    });
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // DB-based admin check (by email, case-insensitive to tolerate mixed-case records)
    const adminEmail = await prisma.adminEmail.findFirst({
      where: { email: { equals: user.email, mode: "insensitive" } },
      select: { id: true },
    });
    if (adminEmail) return next();

    // Optional: allow env-based bootstrap list (comma-separated emails)
    const envAdmins = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    if (envAdmins.includes(String(user.email).toLowerCase())) return next();

    return res.status(403).json({ message: "Admin access required" });
  } catch (e) {
    return res.status(500).json({ message: "Admin check failed" });
  }
};

module.exports = { adminOnly };
