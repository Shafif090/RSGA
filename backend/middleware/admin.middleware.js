const prisma = require("../config/prisma.js");

const adminOnly = async (req, res, next) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true },
    });
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // DB-based admin check (by email)
    const adminEmail = await prisma.adminEmail.findUnique({
      where: { email: user.email.toLowerCase() },
    });
    if (adminEmail) return next();

    if (list.includes(user.email.toLowerCase())) return next();
    return res.status(403).json({ message: "Admin access required" });
  } catch (e) {
    return res.status(500).json({ message: "Admin check failed" });
  }
};

module.exports = { adminOnly };
