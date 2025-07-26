import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export const authenticate = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
