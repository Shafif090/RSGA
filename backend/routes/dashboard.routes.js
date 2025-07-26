import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { getDashboard } from "../controllers/dashboard.controller.js";

const dashboardRouter = Router();

// Protected routes
dashboardRouter.get("/me", authenticate, getDashboard);

export default dashboardRouter;
