import { Router } from "express";
import { register, verify, login } from "../controllers/auth.controller.js";

const authRouter = Router();

// Public routes
authRouter.post("/register", register);
authRouter.get("/verify/:token", verify);
authRouter.post("/login", login);

// Protected routes (will be added later)
// authRouter.post("/logout", logout);

export default authRouter;
