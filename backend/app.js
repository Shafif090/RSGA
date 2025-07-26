import express from "express";
import { PORT } from "./config/env.js";
import prisma from "./config/prisma.js";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/dashboard", dashboardRouter);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(PORT, () => {
  console.log(`Backend is running on ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Database connection closed");
  process.exit(0);
});

export default app;
